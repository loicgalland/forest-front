"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ActivityInterface } from "@/app/interface/Activity.interface";
import ActivityRepository from "@/app/repository/ActivityRepository";
import { LongCard } from "@/app/components/LongCard";
import AuthRepository from "@/app/repository/AuthRepository";
import { useAuth } from "@/app/services/AuthContext";

export default function Activity() {
  const [activities, setActivities] = useState<ActivityInterface[]>([]);
  const { userRole, setUserRole } = useAuth();

  const fetchData = async (role: string) => {
    const response = await ActivityRepository.getAll({
      fullAccess: role === "admin",
      spotlight: false,
    });
    setActivities(response.data.data);
  };

  const getUserRoleAndFetchData = async () => {
    const response = await AuthRepository.getUserRole();
    const role = response.data.role;
    setUserRole(role);
    await fetchData(role);
  };

  useEffect(() => {
    if (!userRole) {
      getUserRoleAndFetchData();
    } else {
      fetchData(userRole);
    }
  }, [userRole]);
  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Nos activités</h2>
        {userRole === "admin" ? (
          <Link
            href="/activity/add"
            className="bg-success text-white p-2 rounded-lg"
          >
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
              <LongCard item={activity} type="activity" key={activity._id} />
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
