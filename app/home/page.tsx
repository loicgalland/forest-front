"use client";

import React, { useEffect, useState } from "react";
import { HostingRepository } from "@/app/repository/HostingRepository";
import { Card } from "@/app/components/Card";
import { Hero } from "@/app/components/Hero";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import { ActivityInterface } from "@/app/interface/Activity.interface";
import { ActivityRepository } from "@/app/repository/ActivityRepository";
import { LongCard } from "@/app/components/LongCard";
import Link from "next/link";
import { EventInterface } from "@/app/interface/Event.interface";
import { EventRepository } from "@/app/repository/EventRepository";
import { AuthRepository } from "@/app/repository/AuthRepository";
import { useAuth } from "@/app/services/AuthContext";
import { Loader } from "@/app/components/Loader";
import { EventCard } from "@/app/components/EventCard";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [hostings, setHostings] = useState<HostingInterface[]>([]);
  const [activities, setActivities] = useState<ActivityInterface[]>();
  const [events, setEvents] = useState<EventInterface[]>();
  const { setUserRole } = useAuth();

  const fetchHosting = async () => {
    setLoading(true);
    const response = await HostingRepository.getAll({
      fullAccess: false,
      spotlight: true,
    });
    if (response.data.data) {
      setHostings(response.data.data);
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    const response = await ActivityRepository.getAll({
      fullAccess: false,
      spotlight: true,
    });
    if (response.data.data) {
      setActivities(response.data.data);
      setLoading(false);
    }
  };

  const fetchEvent = async () => {
    setLoading(true);
    const response = await EventRepository.getAll({
      fullAccess: false,
    });
    if (response.data.data) {
      setEvents(response.data.data);
      setLoading(false);
    }
  };

  const getUserRole = async () => {
    const response = await AuthRepository.getUserRole();
    setUserRole(response.data.role);
  };

  useEffect(() => {
    getUserRole();
    fetchHosting();
    fetchActivities();
    fetchEvent();
  }, []);
  return (
    <div>
      <div className="text-[350px] text-background_icon absolute top-0 right-0 transform rotate-[200deg] -translate-y-[200px] z-[-5] md:text-[500px]">
        <i className="fa-brands fa-pagelines"></i>
      </div>
      {loading ? <Loader /> : null}
      <div className="md:px-20 lg:px-40 xl:px-80 py-2 px-4 mb-5">
        <Hero />
      </div>
      <div className="relative md:px-20 lg:px-40 xl:px-80 py-8 px-4 mb-5 bg-beige">
        {hostings && hostings.length > 0 ? (
          <div>
            <h2 className="md:text-5xl text-3xl font-ligth mb-4">
              Nos coups de cœur
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              {hostings.map((item) => {
                return <Card key={item._id} hosting={item} type="hosting" />;
              })}
            </div>
            <Link
              className="mt-4 w-fit p-2 px-5 rounded-2xl bg-primary text-secondary font-light"
              href={"/hosting"}
            >
              Voir tous nos hébergements
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="md:px-20 lg:px-40 xl:px-80 py-4 px-4 mb-5 bg-secondary">
        {activities && activities.length > 0 ? (
          <div>
            <h2 className="md:text-5xl text-3xl font-ligth mb-4">
              Pour vous occuper pendant votre séjour découvrez nos activités
            </h2>
            <div className="gap-3 mb-3 grid grid-cols-1 lg:grid-cols-2">
              {activities.map((activity) => {
                return (
                  <div className="w-full" key={activity._id}>
                    <LongCard item={activity} type="activity" />
                  </div>
                );
              })}
            </div>
            <Link
              className="mt-4 w-fit p-2 px-5 rounded-2xl bg-primary text-secondary font-light"
              href={"/activity"}
            >
              Découvrir toutes nos activités
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
      {events && events.length > 0 ? (
        <div className="relative md:px-20 lg:px-40 xl:px-80 py-8 px-4 mb-5 bg-beige">
          <div>
            <h2 className="md:text-5xl text-3xl font-ligth mb-4">
              Tout au long de l’année nous organisons plusieurs événements
            </h2>
            <div className="gap-3 mb-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                return (
                  <div className="w-full" key={event._id}>
                    <EventCard item={event} type="event" />
                  </div>
                );
              })}
            </div>
            <Link
              className="mt-4 w-fit p-2 px-5 rounded-2xl bg-primary text-secondary font-light"
              href={"/event"}
            >
              Découvrir tous les événements
            </Link>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
