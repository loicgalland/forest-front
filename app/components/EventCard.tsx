import React from "react";
import { EventInterface } from "@/app/interface/Event.interface";
import Image from "next/image";
import { DB_URL_IMAGE } from "@/app/config/database";
import Link from "next/link";

interface EventCardData {
  item: EventInterface;
  type: string;
  dark: boolean;
}

export const EventCard: React.FC<EventCardData> = (props: EventCardData) => {
  return (
    <div
      className={
        "relative flex shadow-md overflow-hidden rounded-xl w-full text-text mb-2 " +
        (props.dark ? " bg-beige" : " bg-secondary ")
      }
    >
      <div className="relative overflow-hidden text-text bg-white bg-clip-border h-52 w-[50%]">
        <Image
          className="object-cover w-full h-full"
          src={
            props.item.images && props.item.images.length
              ? DB_URL_IMAGE + props.item.images[0].path
              : "https://picsum.photos/200/300?grayscale"
          }
          alt={
            props.item.images && props.item.images[0].originalName
              ? props.item.images[0].originalName
              : "placeholder-image"
          }
          width={300}
          height={300}
        />
      </div>
      <div className="p-4 flex flex-col justify-between w-[50%]">
        <div>
          <h3 className="text-xl font-normal">{props.item.name}</h3>
          <p className="text-sm font-light line-clamp-2">
            {props.item.description}
          </p>
        </div>
        <div>
          <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900 text-nowrap">
            {props.item.price}€<span className="font-light"> / pers</span>
          </p>
          <Link
            href={"/" + props.type + "/" + props.item._id}
            className="text-secondary p-1 px-5 rounded-2xl bg-primary w-fit font-light shadow-sm"
            type="button"
          >
            Réserver
          </Link>
        </div>
      </div>
    </div>
  );
};
