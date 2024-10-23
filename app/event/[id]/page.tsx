"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BottomBar } from "@/app/components/BottomBar";
import { DB_URL_IMAGE } from "@/app/config/database";
import Link from "next/link";
import { EventInterface } from "@/app/interface/Event.interface";
import EventRepository from "@/app/repository/EventRepository";
import DateManager from "@/app/services/dateFormatter";
import ConfirmationModal from "@/app/components/ConfirmationAlertComponent";
import Image from "next/image";
import { useAuth } from "@/app/services/AuthContext";
import AuthRepository from "@/app/repository/AuthRepository";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventInterface>();
  const { userRole, setUserRole } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await EventRepository.getOne(id);
      setEvent(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
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
    return DateManager.dateFormatter(date);
  };

  const getUserRole = async () => {
    const response = await AuthRepository.getUserRole();
    setUserRole(response.data.role);
  };

  useEffect(() => {
    if (!userRole) getUserRole();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
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
        price={event?.price ? event.price : "Prix non définit"}
      />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-3">
          <button
            aria-label="go back  to previous page"
            type="button"
            onClick={() => {
              router.push("/event");
            }}
            className="mr-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          {event?.name}
        </h2>
        {userRole === "admin" && event && (
          <div>
            {userRole}
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
      <div className="flex flex-col md:flex-row">
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
        <div className="w-full md:w-[65%] md:ml-3">
          <div>{event?.date ? formatDate(event.date) : ""}</div>
          <div>{event?.description}</div>
          <p>
            Places disponibles: {event?.placeAvailable}/{event?.capacity}
          </p>
          <div className="hidden md:flex md:w-full items-center justify-between">
            <p className="text-xl font-bold">{event?.price}€</p>
            <button className="p-2 rounded-lg bg-primary w-fit text-white">
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
