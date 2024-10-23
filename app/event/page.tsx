"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LongCard } from "@/app/components/LongCard";
import { EventInterface } from "@/app/interface/Event.interface";
import EventRepository from "@/app/repository/EventRepository";
import { useAuth } from "@/app/services/AuthContext";
import AuthRepository from "@/app/repository/AuthRepository";

export default function Event() {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const { userRole, setUserRole } = useAuth();

  const fetchData = async () => {
    try {
      if (userRole && userRole === "admin") {
        const response = await EventRepository.getAll();
        setEvents(response.data.data);
      } else {
        const response = await EventRepository.getAllVisible();
        setEvents(response.data.data);
      }
    } catch (error) {
      throw error;
    }
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
