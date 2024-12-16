import React from "react";
import Link from "next/link";

interface Props {
  price: number | string;
  type: string;
  hostingId: string;
}

export const BottomBar: React.FC<Props> = (props: Props) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-white shadow-2xl border-t-[1px] border-secondary">
      <p className="font-bold text-xl">
        {props.price}€ {props.type === "hosting" ? "par nuit" : ""}
      </p>
      <Link
        href={"/hosting/booking/" + props.hostingId}
        className="p-2 rounded-lg bg-primary w-fit text-white"
      >
        Réserver
      </Link>
    </div>
  );
};
