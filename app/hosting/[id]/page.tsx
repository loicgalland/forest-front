"use client";
import { useParams, useRouter } from "next/navigation";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import HostingRepository from "@/app/repository/HostingRepository";
import React, { useEffect, useState } from "react";
import { BottomBar } from "@/app/components/BottomBar";
import { IconComponent } from "@/app/components/IconComponent";
import { DB_URL_IMAGE } from "@/app/config/database";
import Link from "next/link";
import ConfirmationModal from "@/app/components/ConfirmationAlertComponent";
import Image from "next/image";
import AuthRepository from "@/app/repository/AuthRepository";
import { useAuth } from "@/app/services/AuthContext";

const HostingDetails = () => {
  const { id } = useParams();
  const [hosting, setHosting] = useState<HostingInterface>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userRole, setUserRole } = useAuth();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await HostingRepository.getHosting(id);
      if (response && response.data) {
        setHosting(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const deleteHosting = async (id: string) => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet événement ?",
    );
    if (confirmation) {
      await HostingRepository.delete(id);
      router.push("/hosting");
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
  }, [userRole]);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      {hosting && hosting._id ? (
        <ConfirmationModal
          id={hosting._id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={deleteHosting}
        />
      ) : (
        ""
      )}
      <BottomBar
        type="hosting"
        price={hosting?.price ? hosting.price : "Pix non définit"}
      ></BottomBar>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-3">
          <button
            aria-label="go back  to previous page"
            type="button"
            onClick={() => {
              router.push("/hosting");
            }}
            className="mr-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          {hosting?.name}
        </h2>
        {userRole === "admin" && hosting && (
          <div>
            <Link
              href={"/hosting/edit/" + hosting?._id}
              className="bg-success text-white p-2 rounded-lg"
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Link>
            <button
              type="button"
              aria-label="delete"
              className="bg-danger text-white p-2 rounded-lg ml-4"
              onClick={() => deleteHosting(hosting._id)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="mb-3 w-full md:w-[33%] grid gap-4">
          {Array.isArray(hosting?.images) && (
            <>
              {hosting.images.length > 0 && (
                <Image
                  className="object-cover max-h-[450px] w-full max-w-full rounded-xl"
                  src={DB_URL_IMAGE + hosting.images[0].path}
                  alt={hosting.images[0].originalName}
                  width={500}
                  height={500}
                />
              )}
              <div className="grid grid-cols-4 gap-4">
                {hosting.images.slice(1).map((image, index) => (
                  <Image
                    key={index}
                    className="object-cover w-full h-[100px] rounded-lg"
                    src={DB_URL_IMAGE + image.path}
                    alt={image.originalName}
                    width={500}
                    height={100}
                  />
                ))}
              </div>
            </>
          )}
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

export default HostingDetails;
