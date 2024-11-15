"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LongCard } from "@/app/components/LongCard";
import { EventInterface } from "@/app/interface/Event.interface";
import { EventRepository } from "@/app/repository/EventRepository";
import { useAuth } from "@/app/services/AuthContext";
import useFetchDataWithUserRole from "@/app/hooks/useFetchDataWithUserRole";

export default function Event() {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const { userRole } = useAuth();

  const fetchData = async (role: string) => {
    const response = await EventRepository.getAll({
      fullAccess: role === "admin",
      spotlight: false,
    });
    if (response.data.data) {
      setEvents(response.data.data);
    }
  };

  useFetchDataWithUserRole([fetchData]);
  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Nos événements</h2>
        {userRole === "admin" ? (
          <Link
            href="/event/add"
            className="bg-success text-white p-2 rounded-lg"
          >
            <i className="fa-solid fa-plus"></i>
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="flex gap-3 flex-wrap">
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
