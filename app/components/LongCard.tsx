import Link from "next/link";
import React from "react";
import { ActivityInterface } from "@/app/interface/Activity.interface";
import { DB_URL_IMAGE } from "@/app/config/database";

interface LongCardData {
  activity: ActivityInterface;
  type: string;
}

export const LongCard: React.FC<LongCardData> = (props: LongCardData) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg relative h-[250px] w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black flex flex-col justify-end p-4 text-white">
        <h2 className="text-3xl font-bold">{props.activity.name}</h2>
        <p className="my-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {props.activity.description}
        </p>
        <Link
          href={"/" + props.type + "/" + props.activity._id}
          className="p-2 rounded-lg bg-primary w-fit"
        >
          En savoir plus
        </Link>
      </div>
      <img
        src={
          props.activity.images && props.activity.images.length
            ? DB_URL_IMAGE + props.activity.images[0]
            : "https://picsum.photos/200/300?grayscale"
        }
        alt=""
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
};
