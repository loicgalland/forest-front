"use client";
import { useParams, useRouter } from "next/navigation";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import { HostingRepository } from "@/app/repository/HostingRepository";
import React, { useState } from "react";
import { BottomBar } from "@/app/components/BottomBar";
import { IconComponent } from "@/app/components/IconComponent";
import { DB_URL_IMAGE } from "@/app/config/database";
import Link from "next/link";
import ConfirmationModal from "@/app/components/ConfirmationAlertComponent";
import Image from "next/image";
import { useAuth } from "@/app/services/AuthContext";
import UseFetchDataWithUserRole from "@/app/hooks/useFetchDataWithUserRole";
import { Loader } from "@/app/components/Loader";

const HostingDetails = () => {
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const [hosting, setHosting] = useState<HostingInterface>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userRole } = useAuth();
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    const response = await HostingRepository.getHosting(id);
    if (response && response.data) {
      setHosting(response.data.data);
      setLoading(false);
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

  UseFetchDataWithUserRole([fetchData]);

  return (
    <div className={"md:px-20 lg:px-40 xl:px-80 py-2 px-4 mb-28 md:mb-5 mt-8"}>
      {loading ? <Loader /> : null}
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
        type={"hosting"}
        price={hosting?.price ? hosting.price : "Pix non définit"}
      ></BottomBar>
      <div className={"flex flex-col md:flex-row"}>
        <div className={"mb-3 w-full md:w-[33%] grid gap-4"}>
          {Array.isArray(hosting?.images) && (
            <>
              {hosting.images.length > 0 && (
                <Image
                  className="object-cover max-h-[450px] w-full max-w-full rounded-xl h-full"
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
        <div className={"w-full md:w-[65%] md:ml-3"}>
          <div className={"flex justify-between items-center mb-3"}>
            <h2 className="md:text-5xl text-3xl font-ligth">{hosting?.name}</h2>
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
          <div className={"max-w-[900px] mb-3"}>{hosting?.description}</div>
          <div className={"mb-3"}>
            Ce logement est prévu pour {hosting?.capacity} personnes
            <ul>
              {hosting?.beds.map((bed) => {
                return (
                  <li className={"font-normal ml-4"} key={bed.bed._id}>
                    - {bed.quantity} {bed.bed.name}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={"w-full"}>
            {hosting?.equipments ? (
              <h4 className={"mb-3"}>
                Les équipements présents dans le logement :
              </h4>
            ) : (
              ""
            )}
            <ul className={"mb-3 grid grid-cols-1 md:grid-cols-2"}>
              {hosting?.equipments.map((equipment, index) => {
                return (
                  <li
                    key={index}
                    className={"bg-beige px-4 py-1 rounded-full w-fit mb-2"}
                  >
                    <IconComponent type={equipment.type} />
                    <span className={"ml-2 pl-3 border-l-[1px] border-text"}>
                      {equipment.name}
                    </span>
                  </li>
                );
              })}
              <li className={"bg-beige px-4 py-1 rounded-full w-fit mb-2"}>
                <i
                  className={"w-[25px] text-center fa-solid fa-ban-smoking"}
                ></i>
                <span className={"ml-2 pl-3 border-l-[1px] border-text"}>
                  Non fumeur
                </span>
              </li>
            </ul>
            <div className={"hidden md:block md:w-full text-xl font-bold mb-3"}>
              {hosting?.price}€ <span className={"font-light"}>/ nuit</span>
            </div>
          </div>
          <Link
            href={"/hosting/booking/" + hosting?._id}
            className={
              "mt-4 w-fit p-1 px-5 rounded-2xl bg-primary text-secondary font-light hidden md:block"
            }
          >
            Réserver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HostingDetails;
