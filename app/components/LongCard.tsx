import Link from "next/link";
import React from "react";
import { ActivityInterface } from "@/app/interface/Activity.interface";
import { DB_URL_IMAGE } from "@/app/config/database";
import Image from "next/image";

interface LongCardData {
  item: ActivityInterface;
  type: string;
}

export const LongCard: React.FC<LongCardData> = (props: LongCardData) => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-md h-[250px] w-full flex flex-col mb-2">
      {props.item.isSpotlight ? (
        <div className="absolute top-5 right-5 text-secondary z-10 text-2xl">
          <i className="fa-solid fa-fire-flame-curved"></i>
        </div>
      ) : (
        ""
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-gradientDarkGrey to-transparent flex flex-col justify-between p-4 text-white">
        <h2 className="text-3xl font-light uppercase">{props.item.name}</h2>
        <div className="w-full flex justify-end">
          <Link
            href={"/" + props.type + "/" + props.item._id}
            className="w-fit p-1 px-5 rounded-2xl bg-primary font-light text-secondary shadow-sm"
          >
            En savoir +
          </Link>
        </div>
      </div>
      <Image
        className="h-full w-full object-cover object-center"
        src={
          props.item.images && props.item.images.length
            ? DB_URL_IMAGE + props.item.images[0].path
            : "https://picsum.photos/200/300?grayscale"
        }
        alt={
          props.item.images &&
          props.item.images.length &&
          props.item.images[0].originalName
            ? props.item.images[0].originalName
            : "placeholder-image"
        }
        width={650}
        height={250}
      />
    </div>
  );
};
