"use client";

import React, { useEffect, useState } from "react";
import HostingRepository from "@/app/repository/HostingRepository";
import { Card } from "@/app/components/Card";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import Link from "next/link";
import AuthRepository from "@/app/repository/AuthRepository";
import { useAuth } from "@/app/services/AuthContext";

export default function Hosting() {
  const [hostings, setHostings] = useState<HostingInterface[]>([]);
  const { userRole, setUserRole } = useAuth();

  const fetchData = async (role: string) => {
    const response = await HostingRepository.getAll({
      fullAccess: role === "admin",
      spotlight: false,
    });
    setHostings(response.data.data);
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
        <h2 className="text-2xl font-bold">Nos hébergements</h2>
        {userRole && userRole === "admin" ? (
          <Link
            href="/hosting/add"
            className="bg-success text-white p-2 rounded-lg"
          >
            <i className="fa-solid fa-plus"></i>
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="flex gap-3 flex-wrap">
        {hostings && hostings.length > 0
          ? hostings.map((hosting) => {
              return (
                <Card hosting={hosting} type="hosting" key={hosting._id} />
              );
            })
          : "Aucun hébergements n'est disponible pour le moment"}
      </div>
    </div>
  );
}
