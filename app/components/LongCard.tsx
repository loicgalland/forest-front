import Link from "next/link";
import React from "react";
import { ActivityInterface } from "@/app/interface/Activity.interface";
import { DB_URL_IMAGE } from "@/app/config/database";
import { EventInterface } from "@/app/interface/Event.interface";

interface LongCardData {
  item: ActivityInterface | EventInterface;
  type: string;
}

export const LongCard: React.FC<LongCardData> = (props: LongCardData) => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-md h-[250px] w-full flex flex-col mb-2">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black flex flex-col justify-end p-4 text-white">
        <h2 className="text-3xl font-bold">{props.item.name}</h2>
        <p className="my-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {props.item.description}
        </p>
        <Link
          href={"/" + props.type + "/" + props.item._id}
          className="p-2 rounded-lg bg-primary w-fit"
        >
          En savoir plus
        </Link>
      </div>
      <img
        src={
          props.item.images && props.item.images.length
            ? DB_URL_IMAGE + props.item.images[0].path
            : "https://picsum.photos/200/300?grayscale"
        }
        alt=""
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
};
