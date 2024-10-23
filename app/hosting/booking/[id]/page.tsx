"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import HostingRepository from "@/app/repository/HostingRepository";
import AuthRepository from "@/app/repository/AuthRepository";
import { useAuth } from "@/app/services/AuthContext";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import Image from "next/image";
import { DB_URL_IMAGE } from "@/app/config/database";
import { DatePickerComponent } from "@/app/components/form/DatePickerComponent";
import { InputComponent } from "@/app/components/form/InputComponent";

const BookHosting = () => {
  const { id } = useParams();
  const [hosting, setHosting] = useState<HostingInterface>();
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [numberOfPerson, setNumberOfPerson] = useState<number>();
  const router = useRouter();
  const { userRole, setUserRole } = useAuth();

  const fetchHosting = async () => {
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

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const getUserRole = async () => {
    const response = await AuthRepository.getUserRole();
    setUserRole(response.data.role);
  };

  useEffect(() => {
    if (!userRole) getUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchHosting();
    }
  }, [userRole]);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h2 className="text-2xl font-bold mb-3">
        <button
          aria-label="go back  to previous page"
          type="button"
          onClick={() => {
            router.back();
          }}
          className="mr-2"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        Réservation : {hosting ? hosting.name : ""}
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
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
        <div className="mb-3 w-full md:w-[67%] grid gap-4">
          <form>
            <div className="flex justify-between gap-4">
              <DatePickerComponent
                label={"Date d'arrivée"}
                olderDate={null}
                onDateChange={handleStartDateChange}
              ></DatePickerComponent>
              <DatePickerComponent
                label={"Date de départ"}
                olderDate={null}
                onDateChange={handleEndDateChange}
              ></DatePickerComponent>
            </div>
            <InputComponent
              type="number"
              name="numberOfPerson"
              label="Nombre de personnes"
              id="numberOfPerson"
              value={numberOfPerson}
              onChange={(e) => setNumberOfPerson(Number(e.target.value))}
            />
            <div>
              <p>Prix par nuit: {hosting?.price}€</p>
              <p>Frais de nettoyage: 15€</p>
              <p>Total: {totalPrice ? totalPrice : "--"}€</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookHosting;
