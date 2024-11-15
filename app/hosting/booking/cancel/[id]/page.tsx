"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookingRepository } from "@/app/repository/BookingRepository";
import { useEffect } from "react";

export default function PaymentCancel() {
  const { id } = useParams();
  const updateBookingStatus = async () => {
    const response = await BookingRepository.update(id as string, "cancelled");
    if (response.status === 200) {
      console.log("Booking payed");
    }
  };
  useEffect(() => {
    updateBookingStatus();
  }, []);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h1 className="text-2xl font-bold mb-3">Réservation annulée</h1>
      <Link
        href="/hosting"
        className="p-2 rounded-lg bg-primary w-fit text-white"
      >
        Réserver un nouvel hébergement
      </Link>
    </div>
  );
}
