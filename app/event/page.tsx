"use client";

import React, { useEffect, useState } from "react";
import { DecodedToken } from "@/app/interface/Token.interface";
import { jwtDecodeService } from "@/app/services/jwtDecodeService";
import Link from "next/link";
import { LongCard } from "@/app/components/LongCard";
import { EventInterface } from "@/app/interface/Event.interface";
import EventRepository from "@/app/repository/EventRepository";

export default function Event() {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [userRole, setUserRole] = useState<DecodedToken | null>();

  const fetchData = async (): Promise<{
    data: { data: EventInterface[]; success: boolean };
  }> => {
    try {
      const role = await jwtDecodeService();
      if (role && role.role === "admin") {
        return await EventRepository.getAll();
      }
      return await EventRepository.getAllVisible();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    setUserRole(jwtDecodeService());
    fetchData().then((response) => {
      if (response && response.data) {
        setEvents(response.data.data);
      }
    });
  }, []);
  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Nos événements</h2>
        {userRole && userRole.role === "admin" ? (
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
