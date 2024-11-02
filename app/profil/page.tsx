"use client";
import { useAuth } from "@/app/services/AuthContext";
import BookingRepository from "@/app/repository/BookingRepository";
import { useEffect, useState } from "react";
import { BookingFullInterface } from "@/app/interface/Booking.interface";
import DateManager from "@/app/services/dateFormatter";

export default function Profil() {
  const { userId } = useAuth();

  const [userBooking, setUserBooking] = useState<BookingFullInterface[] | null>(
    null,
  );

  const formatDate = (date: Date): string => {
    return DateManager.dateFormatter(date);
  };

  const fetchUserBooking = async (id: string) => {
    const response = await BookingRepository.getAllUserBookings(id);
    if (response && response.data.data) {
      setUserBooking(response.data.data);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserBooking(userId);
    }
  }, [userId]);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h2 className="text-2xl font-bold mb-3">Vos réservations</h2>
      {userBooking && userBooking.length ? (
        <div>
          <div className="font-bold ps-4 py-2 hidden md:flex">
            <span className="w-[20%]">Dates</span>
            <span className="w-[10%]">Status</span>
            <span className="w-[20%]">Hébergement</span>
            <span className="w-[20%]">Activités</span>
            <span className="w-[20%]">Événements</span>
          </div>
          <ul>
            {userBooking.map((booking, index) => (
              <li
                key={booking._id}
                className={`relative flex mb-8 md:mb-2 mt-4 items-baseline rounded-md ps-0 py-0 md:ps-4 md:py-2 md:odd:bg-beige md:flex-row flex-col ${
                  index !== userBooking.length - 1
                    ? "after:content-[''] md:after:hidden after:block after:h-[2px] after:w-full after:bg-beige" +
                      " after:bottom-[-20px]" +
                      " after:absolute after:left-0"
                    : ""
                }`}
              >
                <div className="md:w-[20%] w-full md:bg-transparent bg-beige rounded-md ps-4 py-2 md:ps-0 md:py-0">
                  <span className="block">
                    <span className="md:mr-2 md:w-fit w-[40%] inline-block">
                      Arrivée :
                    </span>
                    <span className="font-bold">
                      {formatDate(booking.startDate)}
                    </span>
                  </span>
                  <span className="block">
                    <span className="md:mr-2 md:w-fit w-[40%] inline-block">
                      Départ :
                    </span>
                    <span className="font-bold">
                      {formatDate(booking.endDate)}
                    </span>
                  </span>
                </div>
                <div className="md:w-[10%] w-full flex items-center ps-4 py-2 md:ps-0 md:py-0">
                  <span className="md:hidden block w-[40%]">Status :</span>
                  <div
                    className={
                      "w-[10px] h-[10px] rounded-full " +
                      (booking.status === "pending"
                        ? "bg-danger"
                        : "bg-success")
                    }
                  ></div>
                </div>
                {booking.hostingId ? (
                  <div className="md:w-[20%] w-full flex md:bg-transparent bg-beige rounded-md ps-4 py-2 md:ps-0 md:py-0">
                    <span className="md:hidden block w-[40%]">
                      Hébergement :
                    </span>
                    <span>{booking.hostingId.name}</span>
                  </div>
                ) : (
                  ""
                )}
                {booking.activities ? (
                  <div className="md:w-[20%] w-full flex ps-4 py-2 md:ps-0 md:py-0">
                    <span className="md:hidden block w-[40%]">Activités :</span>
                    <div>
                      {booking.activities.map((activity) => (
                        <span key={activity._id} className="block">
                          {activity.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {booking.events ? (
                  <div className="md:w-[20%] w-full flex md:bg-transparent bg-beige rounded-md ps-4 py-2 md:ps-0 md:py-0">
                    <span className="md:hidden block w-[40%]">Événement :</span>
                    <div>
                      {booking.events.map((event) => (
                        <span key={event._id} className="block">
                          {event.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        "Aucune réservation pour le moment"
      )}
    </div>
  );
}
