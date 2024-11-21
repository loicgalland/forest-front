"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LongCard } from "@/app/components/LongCard";
import { EventInterface } from "@/app/interface/Event.interface";
import { EventRepository } from "@/app/repository/EventRepository";
import { useAuth } from "@/app/services/AuthContext";
import useFetchDataWithUserRole from "@/app/hooks/useFetchDataWithUserRole";
import { Loader } from "@/app/components/Loader";

export default function Event() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventInterface[]>([]);
  const { userRole } = useAuth();

  const fetchData = async (role: string) => {
    setLoading(true);
    const response = await EventRepository.getAll({
      fullAccess: role === "admin",
      spotlight: false,
    });
    if (response.data.data) {
      setEvents(response.data.data);
      setLoading(false);
    }
  };

  useFetchDataWithUserRole([fetchData]);
  return (
    <div className="md:px-20 lg:px-40 xl:px-80 py-2 px-4 mb-5 mt-8">
      {loading ? <Loader /> : null}
      <div className="flex justify-between mb-4 items-center">
        <h1 className="md:text-5xl text-3xl font-ligth">Nos événements</h1>
        {userRole === "admin" ? (
          <Link
            href="/event/add"
            className="bg-success text-white p-2 rounded-lg h-fit font-light"
          >
            <i className="fa-solid fa-plus"></i>
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
        {events && events.length > 0 ? (
          events.map((event) => {
            return <LongCard item={event} type="event" key={event._id} />;
          })
        ) : (
          <div>
            <p>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Aucun événement n'est prévu pour le moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
