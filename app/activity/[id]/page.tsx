"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BottomBar } from "@/app/components/BottomBar";
import { DB_URL_IMAGE } from "@/app/config/database";
import { jwtDecodeService } from "@/app/services/jwtDecodeService";
import Link from "next/link";
import { ActivityInterface } from "@/app/interface/Activity.interface";
import ActivityRepository from "@/app/repository/ActivityRepository";
import ConfirmationModal from "@/app/components/ConfirmationAlertComponent";

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState<ActivityInterface>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchData = async (): Promise<{
    data: { data: ActivityInterface; success: boolean };
  }> => {
    try {
      return await ActivityRepository.getOne(id);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const deleteActivity = async (id: string) => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet événement ?",
    );
    if (confirmation) {
      await ActivityRepository.delete(id);
      router.push("/activity");
    }
  };

  useEffect(() => {
    const userToken = jwtDecodeService();
    if (userToken && userToken.role === "admin") setIsAdmin(true);
    fetchData().then((response) => {
      if (response && response.data) {
        setActivity(response.data.data);
        console.log(response.data);
      }
    });
  }, []);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      {activity && activity._id ? (
        <ConfirmationModal
          id={activity._id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={deleteActivity}
        />
      ) : (
        ""
      )}
      <BottomBar
        type="activity"
        price={activity?.price ? activity.price : "Pix non définit"}
      ></BottomBar>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-3">
          <button onClick={router.back} className="mr-2">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          {activity?.name}
        </h2>
        {isAdmin && activity && (
          <div>
            <Link
              href={"/activity/edit/" + activity?._id}
              className="bg-success text-white p-2 rounded-lg"
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Link>
            <button
              type="button"
              className="bg-danger text-white p-2 rounded-lg ml-4"
              onClick={() => deleteActivity(activity._id)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="mb-3 w-full md:w-[33%] grid gap-4">
          {Array.isArray(activity?.images) && (
            <>
              {activity.images.length > 0 && (
                <img
                  className="h-auto max-w-full rounded-lg"
                  src={DB_URL_IMAGE + activity.images[0].path}
                  alt="card-image"
                />
              )}
              <div className="grid grid-cols-4 gap-4">
                {activity.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    className="object-cover w-full h-[100px] rounded-xl"
                    src={DB_URL_IMAGE + image.path}
                    alt="card-image"
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="w-full md:w-[65%] md:ml-3">
          <div>{activity?.description}</div>
          <div className="hidden md:flex md:w-full items-center justify-between">
            <p className="text-xl font-bold">{activity?.price}€</p>
            <button className="p-2 rounded-lg bg-primary w-fit text-white">
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
