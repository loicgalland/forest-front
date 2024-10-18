import Link from "next/link";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import React from "react";
import { DB_URL_IMAGE } from "@/app/config/database";

interface CardProps {
  hosting: HostingInterface;
  type: string;
}

export const Card: React.FC<CardProps> = (props: CardProps) => {
  return (
    <div className="relative flex flex-col bg-white shadow-md overflow-hidden rounded-xl w-[100%] sm:w-[49%] md:w-[32%] text-text mb-2 ">
      {props.hosting.isSpotlight ? (
        <div className="absolute top-5 right-5 text-primary z-10 text-2xl">
          <i className="fa-regular fa-heart"></i>
        </div>
      ) : (
        ""
      )}
      <div className="relative overflow-hidden text-text bg-white bg-clip-border h-52">
        <img
          src={
            props.hosting.images && props.hosting.images.length
              ? DB_URL_IMAGE + props.hosting.images[0]
              : "https://picsum.photos/200/300?grayscale"
          }
          alt="card-image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6 h-[50%] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">{props.hosting.name}</h3>
            <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900 text-right">
              {props.hosting.price}€
            </p>
          </div>
          <p className="block font-sans text-sm antialiased font-normal leading-normal overflow-hidden overflow-ellipsis text-nowrap ">
            {props.hosting.description}
          </p>
        </div>
        <div className="text-white">
          <Link
            href={"/" + props.type + "/" + props.hosting._id}
            className="p-2 rounded-lg bg-primary w-fit"
            type="button"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </div>
  );
};
