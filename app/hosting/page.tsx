"use client";

import React, { useEffect, useState } from "react";
import HostingRepository from "@/app/repository/HostingRepository";
import { Card } from "@/app/components/Card";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import { DecodedToken } from "@/app/interface/Token.interface";
import { jwtDecodeService } from "@/app/services/jwtDecodeService";
import Link from "next/link";

export default function Hosting() {
  const [hostings, setHostings] = useState<HostingInterface[]>([]);
  const [userRole, setUserRole] = useState<DecodedToken | null>();

  const fetchData = async (): Promise<{
    data: { data: HostingInterface[]; success: boolean };
  }> => {
    try {
      const role = await jwtDecodeService();
      if (role && role.role === "admin") {
        return await HostingRepository.getAll();
      }
      return await HostingRepository.getAllVisible();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    setUserRole(jwtDecodeService());
    fetchData().then((response) => {
      if (response && response.data) {
        setHostings(response.data.data);
      }
    });
  }, []);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Nos hébergements</h2>
        {userRole && userRole.role === "admin" ? (
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
