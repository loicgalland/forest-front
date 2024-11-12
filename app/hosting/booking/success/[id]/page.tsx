"use client";
import { useParams } from "next/navigation";
import BookingRepository from "@/app/repository/BookingRepository";
import { useEffect } from "react";
import Link from "next/link";

export default function PaymentSuccess() {
  const { id } = useParams();
  const updateBookingStatus = async () => {
    const response = await BookingRepository.update(id as string, "payed");
    if (response.status === 200) {
      console.log("Booking payed");
    }
  };
  useEffect(() => {
    updateBookingStatus();
  }, []);
  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h1 className="text-2xl font-bold mb-3">
        Merci pour votre réservation nous avons hâte de vous voir
      </h1>
      <Link href="/" className="p-2 rounded-lg bg-primary w-fit text-white">
        Retour à l'accueil
      </Link>
    </div>
  );
}
