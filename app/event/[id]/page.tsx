"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BottomBar } from "@/app/components/BottomBar";
import { DB_URL_IMAGE } from "@/app/config/database";
import { jwtDecodeService } from "@/app/services/jwtDecodeService";
import Link from "next/link";
import { EventInterface } from "@/app/interface/Event.interface";
import EventRepository from "@/app/repository/EventRepository";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventInterface>();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const fetchData = async (): Promise<{
    data: { data: EventInterface; success: boolean };
  }> => {
    try {
      return await EventRepository.getOne(id);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    await EventRepository.delete(id);
    router.push("/event");
  };

  useEffect(() => {
    const userToken = jwtDecodeService();
    if (userToken && userToken.role === "admin") setIsAdmin(true);
    fetchData().then((response) => {
      if (response && response.data) {
        setEvent(response.data.data);
      }
    });
  }, []);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <BottomBar
        type="event"
        price={event?.price ? event.price : "Pix non définit"}
      ></BottomBar>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-3">
          <button onClick={router.back} className="mr-2">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          {event?.name}
        </h2>
        {isAdmin && event && (
          <div>
            <Link
              href={"/event/edit/" + event?._id}
              className="bg-success text-white p-2 rounded-lg"
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Link>
            <button
              type="button"
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
                <img
                  className="h-auto max-w-full rounded-lg"
                  src={DB_URL_IMAGE + event.images[0].path}
                  alt="card-image"
                />
              )}
              <div className="grid grid-cols-4 gap-4">
                {event.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    className="object-cover w-full h-[100px] rounded-xl"
                    src={DB_URL_IMAGE + image.path}
                    alt="card-image"
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="w-full md:w-[65%] md:ml-3">
          <div>{event?.description}</div>
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
