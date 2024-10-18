"use client";
import { useParams } from "next/navigation";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import HostingRepository from "@/app/repository/HostingRepository";
import React, { useEffect, useState } from "react";
import { BottomBar } from "@/app/components/BottomBar";
import { IconComponent } from "@/app/components/IconComponent";
import { DB_URL_IMAGE } from "@/app/config/database";
import { jwtDecodeService } from "@/app/services/jwtDecodeService";
import Link from "next/link";

const HomeDetails = () => {
  const { id } = useParams();
  const [hosting, setHosting] = useState<HostingInterface>();
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async (): Promise<{
    data: { data: HostingInterface; success: boolean };
  }> => {
    try {
      return await HostingRepository.getHosting(id);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  useEffect(() => {
    const userToken = jwtDecodeService();
    if (userToken && userToken.role === "admin") setIsAdmin(true);
    fetchData().then((response) => {
      if (response && response.data) {
        setHosting(response.data.data);
        console.log(response.data);
      }
    });
  }, []);

  return (
    <div>
      <BottomBar
        price={hosting?.price ? hosting.price : "Pix non définit"}
      ></BottomBar>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-3">{hosting?.name}</h2>
        {isAdmin && (
          <Link href={"/hosting/edit/" + hosting?._id}>
            <i className="fa-regular fa-pen-to-square"></i>
          </Link>
        )}
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="mb-3 w-full md:w-[33%]">
          <img
            src={
              hosting?.images && hosting?.images.length
                ? DB_URL_IMAGE + hosting.images[0]
                : "https://picsum.photos/200/300?grayscale"
            }
            alt="card-image"
            className="object-cover w-full h-full rounded-xl aspect-square"
          />
        </div>
        <div className="w-full md:w-[65%] md:ml-3">
          <div>{hosting?.description}</div>
          <div className="hidden md:flex md:w-full items-center justify-between">
            <p className="text-xl font-bold">{hosting?.price}€ par nuit</p>
            <button className="p-2 rounded-lg bg-primary w-fit text-white">
              Réserver
            </button>
          </div>
          <div>Ce logement est prévu pour {hosting?.capacity} personnes</div>
          <ul className="border-t-[1px] border-dotted border-text w-full md:w-[50%] mt-3 pt-2">
            {hosting?.equipments.map((equipment, index) => {
              return (
                <li key={index}>
                  <IconComponent type={equipment.type} />
                  <span className="mr-2"> {equipment.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeDetails;
