"use client";
import { useParams, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { DB_URL_IMAGE } from "@/app/config/database";
import { InputComponent } from "@/app/components/form/InputComponent";
import { AuthRepository } from "@/app/repository/AuthRepository";
import { EventRepository } from "@/app/repository/EventRepository";
import { EventInterface } from "@/app/interface/Event.interface";
import { BookingRepository } from "@/app/repository/BookingRepository";
import { PaymentRepository } from "@/app/repository/PaymentRepository";
import { loadStripe } from "@stripe/stripe-js";
import { Loader } from "@/app/components/Loader";

const BookEvent = () => {
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const [numberOfPerson, setNumberOfPerson] = useState<number>(0);
  const [event, setEvent] = useState<EventInterface>();
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const router = useRouter();
  const [userId, setUserId] = useState<string>("");

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY!);
  const currency = "eur";

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const response = await BookingRepository.post({
      userId: userId,
      numberOfPerson: numberOfPerson,
      totalPrice: totalPrice,
      events: event ? [event._id] : [],
    });
    if (response && response.data) {
      const stripe = await stripePromise;
      const stripeResponse = await PaymentRepository.post(
        totalPrice * 100,
        currency,
        response.data.data._id,
      );

      const session = stripeResponse.data;

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      }
    } else {
      console.warn("Form submission failed due to missing data.");
    }
  };

  const fetchEvent = async (id: string | string[]) => {
    setLoading(true);
    const response = await EventRepository.getOne(id);
    if (response && response.data.data) {
      setEvent(response.data.data);
      setLoading(false);
    }
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

  useEffect(() => {
    if (event?.price) {
      setTotalPrice(event.price * numberOfPerson);
    } else {
      setTotalPrice(0);
    }
  }, [numberOfPerson, event]);

  useEffect(() => {
    const fetchUser = async () => {
      await getUser();
      await fetchEvent(id);
    };

    fetchUser();
  }, []);
  return (
    <div className="md:px-20 lg:px-40 xl:px-80 py-2 px-4 mb-5">
      {loading ? <Loader /> : null}
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
        Réservation : {event ? event.name : ""}
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="mb-3 w-full md:w-[33%] grid gap-4">
          {Array.isArray(event?.images) && (
            <>
              {event.images.length > 0 && (
                <Image
                  className="object-cover max-h-[450px] w-full max-w-full rounded-xl"
                  src={DB_URL_IMAGE + event.images[0].path}
                  alt={event.images[0].originalName}
                  width={500}
                  height={500}
                />
              )}
              <div className="grid grid-cols-4 gap-4">
                {event.images.slice(1).map((image, index) => (
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
              <p>Prix par personne: {event?.price}€</p>
            </div>
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

export default BookEvent;
