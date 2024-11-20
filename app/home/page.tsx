"use client";

import { useEffect, useState } from "react";
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
      spotlight: false,
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
      {loading ? <Loader /> : null}
      <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
        <Hero
          title="Titre du site"
          image="https://picsum.photos/200/300?grayscale"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
      </div>
      <div className="relative md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
        {hostings && hostings.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-2">Nos coups de cœur</h2>
            <div className="flex gap-3 flex-wrap mb-3">
              {hostings.map((item) => {
                return <Card key={item._id} hosting={item} type="hosting" />;
              })}
            </div>
            <Link
              className="w-full md:w-fit p-2 md:px-5 rounded-lg bg-primary text-white"
              href={"/hosting"}
            >
              Tous les hébergements
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="md:px-20 lg:px-40 xl:px-60 py-4 px-4 mb-5 bg-secondary">
        {activities && activities.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-2">Découvrez nos activités</h2>
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
              className="w-full md:w-fit p-2 md:px-5 rounded-lg bg-primary text-white"
              href={"/activity"}
            >
              Toutes les activités
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
      {events && events.length > 0 ? (
        <div className="md:px-20 lg:px-40 xl:px-60 py-4 px-4 mb-5">
          <div>
            <h2 className="text-xl font-bold mb-2">Nos évenéments</h2>
            <div className="gap-3 mb-3 grid grid-cols-1 lg:grid-cols-2">
              {events.map((event) => {
                return (
                  <div className="w-full" key={event._id}>
                    <LongCard item={event} type="event" />
                  </div>
                );
              })}
            </div>
            <Link
              className="w-full md:w-fit p-2 md:px-5 rounded-lg bg-primary text-white"
              href={"/event"}
            >
              Tous les événements
            </Link>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
