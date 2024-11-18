"use client";
import { DB_URL_IMAGE } from "@/app/config/database";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/services/AuthContext";
import useFetchDataWithUserRole from "@/app/hooks/useFetchDataWithUserRole";
import { DatePickerComponent } from "@/app/components/form/DatePickerComponent";
import { CheckBoxInputComponent } from "@/app/components/form/CheckBoxInputComponent";
import { InputComponent } from "@/app/components/form/InputComponent";
import { BookingInterface } from "@/app/interface/Booking.interface";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import { ActivityInterface } from "@/app/interface/Activity.interface";
import { HostingRepository } from "@/app/repository/HostingRepository";
import { BookingRepository } from "@/app/repository/BookingRepository";
import { ActivityRepository } from "@/app/repository/ActivityRepository";
import { AuthRepository } from "@/app/repository/AuthRepository";
import { EventRepository } from "@/app/repository/EventRepository";
import { EventInterface } from "@/app/interface/Event.interface";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentRepository } from "@/app/repository/PaymentRepository";

const BookHosting = () => {
  const { id } = useParams();
  const [hosting, setHosting] = useState<HostingInterface>();
  const [activitiesList, setActivitiesList] = useState<ActivityInterface[]>([]);
  const [eventList, setEventList] = useState<EventInterface[]>([]);

  const [activitiesPrice, setActivitiesPrice] = useState<number>(0);
  const [activities, setActivities] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [totalPrice, setTotalPrice] = useState<number | 0>(0);
  const [numberOfPerson, setNumberOfPerson] = useState<number>(1);
  const [fees] = useState<number>(15);
  const [bookings, setBookings] = useState<BookingInterface[]>([]);
  const [dateBooked, setDateBooked] = useState<Date[]>([]);

  const [errors, setErrors] = useState<string | null>(null);
  const router = useRouter();
  const { userRole } = useAuth();
  const [userId, setUserId] = useState<string>("");

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY!);
  const currency = "eur";

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let duration;
    if (startDate && endDate && totalPrice && userId) {
      const hostingId = id;
      duration = getDuration(startDate, endDate);
      const response = await BookingRepository.post({
        startDate,
        endDate,
        duration,
        userId,
        numberOfPerson,
        hostingId,
        totalPrice,
        activities,
        events,
      });
      if (response && response.data) {
        const stripe = await stripePromise;
        const stripeResponse = await PaymentRepository.post(
          totalPrice * 100,
          currency,
          response.data.data._id,
        );
        const session = stripeResponse.data.data;

        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: session.id });
        }
      } else {
        console.warn("Form submission failed due to missing data.");
      }
    }
  };

  const fetchHosting = async () => {
    const response = await HostingRepository.getHosting(id);
    if (response && response.data) {
      setHosting(response.data.data);
    }
  };

  const fetchActivities = async (role: string) => {
    const response = await ActivityRepository.getAll({
      fullAccess: role === "admin",
      spotlight: false,
    });
    if (response && response.data.data) {
      setActivitiesList(response.data.data);
    }
  };

  const fetchEvents = async (startDate: Date, endDate: Date) => {
    const response = await EventRepository.getAll({
      startDate: startDate,
      endDate: endDate,
    });
    if (response && response.data.data) {
      setEventList(response.data.data);
    }
  };

  const fetchBooking = async (id: string | string[]) => {
    const response = await BookingRepository.getAllBookingsForHosting(id);
    if (response && response.data) {
      setBookings(response && response.data.data);
    }
  };

  const getDateAlreadyBooked = (): Date[] => {
    const dates: Date[] = [];
    if (Array.isArray(bookings) && bookings.length > 0) {
      bookings.forEach((booking) => {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);

        for (
          let date = startDate;
          date <= endDate;
          date.setDate(date.getDate() + 1)
        ) {
          dates.push(new Date(date));
        }
      });
    }
    return dates;
  };

  function getDuration(startDate: Date, endDate: Date) {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    const difference = Math.abs(endTime - startTime);
    return Math.round(difference / (1000 * 60 * 60 * 24));
  }

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const getUser = async () => {
    const response = await AuthRepository.getUserRole();
    if (response && response.data) {
      if (!response.data.role) {
        router.push("/login");
      }
      setUserId(response.data.userId);
    }
  };

  useFetchDataWithUserRole([fetchHosting, fetchActivities]);
  useEffect(() => {
    if (userRole) {
      fetchBooking(id);
    }
  }, [userRole]);

  useEffect(() => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        setErrors(
          "Veuillez choisir une date d'arrivée antérieure à la date de départ",
        );
      } else {
        setErrors(null);
        const duration = getDuration(startDate, endDate);
        const price = hosting ? hosting.price : 0;
        setTotalPrice(duration * price + fees + activitiesPrice);
        fetchEvents(startDate, endDate);
      }
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const bookedDates = getDateAlreadyBooked();
    setDateBooked(bookedDates);
  }, [bookings]);

  useEffect(() => {
    const fetchUser = async () => {
      await getUser();
    };

    fetchUser();
  }, []);
  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h1 className="text-2xl font-bold mb-3">
        <button
          aria-label="go back  to previous page"
          type="button"
          onClick={() => {
            router.back();
          }}
          className="mr-2"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        Réservation : {hosting ? hosting.name : ""}
      </h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="mb-3 w-full md:w-[33%] grid gap-4">
          {Array.isArray(hosting?.images) && (
            <>
              {hosting.images.length > 0 && (
                <Image
                  className="object-cover max-h-[450px] w-full max-w-full rounded-xl"
                  src={DB_URL_IMAGE + hosting.images[0].path}
                  alt={hosting.images[0].originalName}
                  width={500}
                  height={500}
                />
              )}
              <div className="grid grid-cols-4 gap-4">
                {hosting.images.slice(1).map((image, index) => (
                  <Image
                    key={index}
                    className="object-cover w-full h-[100px] rounded-lg"
                    src={DB_URL_IMAGE + image.path}
                    alt={image.originalName}
                    width={500}
                    height={100}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="mb-3 w-full md:w-[67%] grid gap-4">
          <form onSubmit={submit}>
            <div className="flex justify-between gap-4">
              <DatePickerComponent
                label={"Date d'arrivée"}
                olderDate={null}
                onDateChange={handleStartDateChange}
                blockedDates={dateBooked}
              ></DatePickerComponent>
              <DatePickerComponent
                label={"Date de départ"}
                olderDate={null}
                onDateChange={handleEndDateChange}
                blockedDates={dateBooked}
              ></DatePickerComponent>
            </div>
            {errors ? <p className="text-danger">{errors}</p> : ""}
            <div>
              <InputComponent
                type="number"
                name="numberOfPerson"
                id="numberOfPerson"
                label="Nombre de personnes"
                value={numberOfPerson}
                onChange={(e) => {
                  setNumberOfPerson(Number(e.target.value));
                }}
              />
            </div>
            <div>
              <p>Prix par nuit: {hosting?.price}€</p>
              <p>Frais de nettoyage: {fees}€</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Ajouter une activité</h3>
              <div>
                {activitiesList && activitiesList.length
                  ? activitiesList.map((activity) => (
                      <CheckBoxInputComponent
                        id={activity._id}
                        key={activity._id}
                        name={activity.name}
                        label={activity.name}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setActivities((prevActivities) => [
                              ...prevActivities,
                              activity._id,
                            ]);
                            setActivitiesPrice(
                              (prevPrice) => prevPrice + activity.price,
                            );
                            setTotalPrice(
                              (prevPrice) => prevPrice + activitiesPrice,
                            );
                          } else {
                            setActivities((prevActivities) =>
                              prevActivities.filter(
                                (id) => id !== activity._id,
                              ),
                            );
                            setTotalPrice(
                              (prevPrice) => prevPrice - activity.price,
                            );
                          }
                        }}
                      />
                    ))
                  : ""}
              </div>
            </div>
            {Array.isArray(eventList) && eventList && eventList.length > 0 ? (
              <div>
                <h3 className="font-bold text-lg">
                  Venez profiter de nos événements
                </h3>
                {eventList.map((event) => (
                  <CheckBoxInputComponent
                    id={event._id}
                    key={event._id}
                    name={event.name}
                    label={event.name}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEvents((prevEvent) => [...prevEvent, event._id]);
                        setTotalPrice((prevPrice) => prevPrice + event.price);
                      } else {
                        setEvents((prevEvent) =>
                          prevEvent.filter((id) => id !== event._id),
                        );
                        setTotalPrice((prevPrice) => prevPrice - event.price);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              ""
            )}
            <p>Total: {totalPrice ? totalPrice : "--"}€</p>
            <input
              type="submit"
              value="Réserver"
              aria-label="submit"
              className="mt-2 w-full md:w-fit p-2 md:px-5 rounded-lg bg-primary text-white mr-0 md:mr-2 cursor-pointer"
            />
            <button
              type="button"
              aria-label="cancel"
              className="mt-2 w-full md:w-fit p-2 md:px-5 rounded-lg bg-danger text-white"
              onClick={() => {
                router.back();
              }}
            >
              Annuler
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookHosting;
