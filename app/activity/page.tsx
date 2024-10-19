"use client";

import React, { useEffect, useState } from "react";
import { DecodedToken } from "@/app/interface/Token.interface";
import { jwtDecodeService } from "@/app/services/jwtDecodeService";
import Link from "next/link";
import { ActivityInterface } from "@/app/interface/Activity.interface";
import ActivityRepository from "@/app/repository/ActivityRepository";
import { LongCard } from "@/app/components/LongCard";

export default function Activity() {
  const [activities, setActivities] = useState<ActivityInterface[]>([]);
  const [userRole, setUserRole] = useState<DecodedToken | null>();

  const fetchData = async (): Promise<{
    data: { data: ActivityInterface[]; success: boolean };
  }> => {
    try {
      return await ActivityRepository.getAll();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    setUserRole(jwtDecodeService());
    fetchData().then((response) => {
      if (response && response.data) {
        setActivities(response.data.data);
      }
    });
  }, []);
  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Nos Activités</h2>
        {userRole && userRole.role === "admin" ? (
          <Link href="/activity/add">
            <i className="fa-solid fa-plus"></i>
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="flex gap-3 flex-wrap">
        {activities && activities.length > 0 ? (
          activities.map((activity) => {
            return (
              <LongCard
                activity={activity}
                type="activity"
                key={activity._id}
              />
            );
          })
        ) : (
          <div>
            <p>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Aucune activité n'est disponible pour le moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
