"use client";

import { useEffect, useState } from "react";
import HostingRepository from "@/app/repository/HostingRepository";
import { Card } from "@/app/components/Card";
import { Hero } from "@/app/components/Hero";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import { ActivityInterface } from "@/app/interface/Activity.interface";
import ActivityRepository from "@/app/repository/ActivityRepository";
import { LongCard } from "@/app/components/LongCard";
import Link from "next/link";

export default function Home() {
  const [hostings, setHostings] = useState<HostingInterface[]>([]);
  const [activities, setActivities] = useState<ActivityInterface[]>();

  const fetchHosting = async (): Promise<{
    data: { data: HostingInterface[]; success: boolean };
  }> => {
    try {
      return await HostingRepository.getSpotlight();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const fetchActivities = async (): Promise<{
    data: { data: ActivityInterface[]; success: boolean };
  }> => {
    try {
      return await ActivityRepository.getSpotlight();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchHosting().then((response) => {
      if (response && response.data) {
        setHostings(response.data.data);
      }
    });
    fetchActivities().then((response) => {
      if (response && response.data) {
        setActivities(response.data.data);
      }
    });
  }, []);

  return (
    <div>
      <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
        <Hero
          title="Titre du site"
          image="https://picsum.photos/200/300?grayscale"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
      </div>
      <div className=" md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
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

      {activities && activities.length > 0 ? (
        <div className="md:px-20 lg:px-40 xl:px-60 py-4 px-4 mb-5 bg-secondary">
          <div>
            <h2 className="text-xl font-bold mb-2">Découvrez nos activités</h2>
            <div className="gap-3 mb-3 grid grid-cols-1 lg:grid-cols-2">
              {activities.map((activity) => {
                return (
                  <div className="w-full" key={activity._id}>
                    <LongCard activity={activity} type="activity" />
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
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
