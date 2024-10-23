"use client";
import { useParams, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import HostingRepository from "@/app/repository/HostingRepository";
import AuthRepository from "@/app/repository/AuthRepository";
import { useAuth } from "@/app/services/AuthContext";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import Image from "next/image";
import { DB_URL_IMAGE } from "@/app/config/database";
import { DatePickerComponent } from "@/app/components/form/DatePickerComponent";
import { InputComponent } from "@/app/components/form/InputComponent";
import BookingRepository from "@/app/repository/BookingRepository";
import { BookingInterface } from "@/app/interface/Booking.interface";

const BookHosting = () => {
  const { id } = useParams();
  const [hosting, setHosting] = useState<HostingInterface>();
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [numberOfPerson, setNumberOfPerson] = useState<number>(1);
  const [fees, setFees] = useState<number>(15);
  const [bookings, setBookings] = useState<BookingInterface[]>([]);
  const [dateBooked, setDateBooked] = useState<Date[]>([]);

  const [errors, setErrors] = useState<string | null>(null);
  const router = useRouter();
  const { userRole, setUserRole } = useAuth();
  const [userId, setUserId] = useState<string>("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let duration;
    if (startDate && endDate && totalPrice) {
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
      });
      if (response && response.data) {
        router.push("/");
      }
    }
  };

  const fetchHosting = async () => {
    try {
      const response = await HostingRepository.getHosting(id);
      if (response && response.data) {
        setHosting(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const fetchBooking = async (id: string | string[]) => {
    const response = await BookingRepository.getAllBookingsForHosting(id);
    if (response && response.data) {
      setBookings(response.data.data);
    }
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

  const getUserRole = async () => {
    const response = await AuthRepository.getUserRole();
    setUserRole(response.data.role);
    setUserId(response.data.userId);
  };

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
        setTotalPrice(duration * price + fees);
      }
    } else {
      setTotalPrice(null);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!userRole) getUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchHosting();
      fetchBooking(id);
    }
  }, [userRole]);

  useEffect(() => {
    const dates: Date[] = [];
    if (bookings && bookings.length) {
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
    setDateBooked(dates);
  }, [bookings]);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h2 className="text-2xl font-bold mb-3">
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
      </h2>
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
              <p>Total: {totalPrice ? totalPrice : "--"}€</p>
            </div>
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
