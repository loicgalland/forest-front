import Link from "next/link";
import { HostingInterface } from "@/app/interface/Hosting.interface";
import React from "react";
import { DB_URL_IMAGE } from "@/app/config/database";
import Image from "next/image";

interface CardProps {
  hosting: HostingInterface;
  type: string;
  dark: boolean;
}

export const Card: React.FC<CardProps> = (props: CardProps) => {
  return (
    <div
      className={
        "relative flex flex-col shadow-md overflow-hidden rounded-xl w-full text-text mb-2 " +
        (props.dark ? " bg-beige" : " bg-secondary ")
      }
    >
      {props.hosting.isSpotlight ? (
        <div className="absolute top-5 right-5 text-secondary z-10 text-2xl">
          <i className="fa-solid fa-fire-flame-curved"></i>
        </div>
      ) : (
        ""
      )}
      <div className="relative overflow-hidden text-text bg-white bg-clip-border h-52">
        <Image
          className="object-cover w-full h-full"
          src={
            props.hosting.images && props.hosting.images.length
              ? DB_URL_IMAGE + props.hosting.images[0].path
              : "https://picsum.photos/200/300?grayscale"
          }
          alt={
            props.hosting.images && props.hosting.images[0].originalName
              ? props.hosting.images[0].originalName
              : "placeholder-image"
          }
          width={300}
          height={300}
        />
      </div>
      <div className={"p-6 h-[50%] flex flex-col justify-between "}>
        <div>
          <h3 className="text-xl font-normal">{props.hosting.name}</h3>
          <p className="text-sm font-light line-clamp-2">
            {props.hosting.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900 text-right">
            {props.hosting.price}€<span className="font-light"> / nuit</span>
          </p>
          <Link
            href={"/" + props.type + "/" + props.hosting._id}
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
