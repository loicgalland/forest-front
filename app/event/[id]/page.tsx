"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { BottomBar } from "@/app/components/BottomBar";
import { DB_URL_IMAGE } from "@/app/config/database";
import Link from "next/link";
import { EventInterface } from "@/app/interface/Event.interface";
import { EventRepository } from "@/app/repository/EventRepository";
import { DateService } from "@/app/services/DateService";
import ConfirmationModal from "@/app/components/ConfirmationAlertComponent";
import Image from "next/image";
import { useAuth } from "@/app/services/AuthContext";
import useFetchDataWithUserRole from "@/app/hooks/useFetchDataWithUserRole";
import { Loader } from "@/app/components/Loader";

const EventDetail = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [event, setEvent] = useState<EventInterface>();
  const { userRole } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    const response = await EventRepository.getOne(id);
    if (response.data.data) {
      setEvent(response.data.data);
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet événement ?",
    );
    if (confirmation) {
      await EventRepository.delete(id);
      router.push("/event");
    }
  };

  const formatDate = (date: Date): string => {
    return DateService.dateFormatter(date);
  };

  useFetchDataWithUserRole([fetchData]);

  return (
    <div className="md:px-20 lg:px-40 xl:px-80 py-2 px-4 mb-28 md:mb-5 mt-8">
      {loading ? <Loader /> : null}
      {event && event._id ? (
        <ConfirmationModal
          id={event._id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={deleteEvent}
        />
      ) : (
        ""
      )}
      <BottomBar
        type="event"
        hostingId={event?._id ? event?._id : ""}
        price={event?.price ? event.price : "Prix non définit"}
      />
      <div className="flex flex-col md:flex-row">
        <div className="mb-3 w-full md:w-[33%] grid gap-4">
          {Array.isArray(event?.images) && (
            <>
              {event.images.length > 0 && (
                <Image
                  className="object-cover max-h-[450px] w-full max-w-full rounded-xl h-full"
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
        <div className="w-full md:w-[65%] md:ml-3">
          <div className="flex justify-between items-center mb-3">
            <h2 className="md:text-5xl text-3xl font-ligth">{event?.name}</h2>
            {userRole === "admin" && event && (
              <div>
                <Link
                  href={"/event/edit/" + event?._id}
                  className="bg-success text-white p-2 rounded-lg"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </Link>
                <button
                  type="button"
                  aria-label="delete"
                  className="bg-danger text-white p-2 rounded-lg ml-4"
                  onClick={() => deleteEvent(event._id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            )}
          </div>
          <div className={"mb-3 font-bold text-xl"}>
            {event?.date ? formatDate(event.date) : ""}
          </div>
          <div className={"mb-3"}>{event?.description}</div>
          <p className={"mb-3"}>
            Places disponibles:{" "}
            <span className={"font-bold"}>
              {event?.placeAvailable} / {event?.capacity}
            </span>
          </p>
          <p className="text-xl font-bold">{event?.price}€</p>
          <Link
            href={"/event/booking/" + event?._id}
            className="mt-4 w-fit p-1 px-5 rounded-2xl bg-primary text-secondary font-light hidden md:block"
          >
            Réserver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
