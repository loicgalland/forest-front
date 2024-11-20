"use client";

import React, { useState } from "react";
import { HostingRepository } from "@/app/repository/HostingRepository";
import { Card } from "@/app/components/Card";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import Link from "next/link";
import { useAuth } from "@/app/services/AuthContext";
import useFetchDataWithUserRole from "@/app/hooks/useFetchDataWithUserRole";
import { Loader } from "@/app/components/Loader";

export default function Hosting() {
  const [loading, setLoading] = useState(false);

  const [hostings, setHostings] = useState<HostingInterface[]>([]);
  const { userRole } = useAuth();

  const fetchData = async (role: string) => {
    setLoading(true);
    const response = await HostingRepository.getAll({
      fullAccess: role === "admin",
      spotlight: false,
    });
    setHostings(response.data.data);
    setLoading(false);
  };

  useFetchDataWithUserRole([fetchData]);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      {loading ? <Loader /> : null}
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
