import React from "react";
import Image from "next/image";
import HeroImage from "../assets/images/heroImage.jpg";
import Link from "next/link";

export const Hero: React.FC = () => {
  return (
    <div className="flex gap-5 my-5 md:my-24 md:flex-row flex-col md:items-center">
      <div className="flex flex-col w-full md:w-[65%]">
        <div className="flex flex-col">
          <h1 className="md:text-7xl text-5xl font-light">FOREST</h1>
          <h2 className="text-2xl font-light mt-2">
            Vivez l'expérience unique de la nature
          </h2>
          <p className="w-full mt-5 mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </div>
        <Link
          className="w-fit p-1 px-5 rounded-lg bg-primary text-secondary font-light"
          href={"/hosting"}
        >
          Nos hébergements
        </Link>
      </div>

      <Image
        className="rounded-xl w-full md:w-[35%] h-[350px] object-cover"
        style={{ width: "auto", height: "auto" }}
        src={HeroImage}
        alt="Image heor"
        width={300}
        height={350}
        priority
      />
    </div>
  );
};
