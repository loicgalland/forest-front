import React, { useEffect, useState } from "react";

interface Props {
  type: string;
}

export const IconComponent: React.FC<Props> = (props: Props) => {
  const [icon, setIcon] = useState("");

  useEffect(() => {
    switch (props.type) {
      case "coffee":
        setIcon("mug-hot");
        break;
      case "food":
        setIcon("utensils");
        break;
      case "wifi":
        setIcon("wifi");
        break;
      case "kitchen":
        setIcon("kitchen-set");
        break;
      case "tv":
        setIcon("tv");
        break;
      case "bathroom":
        setIcon("bath");
        break;
      case "wash":
        setIcon("hand-sparkles");
        break;
    }
  }, [props.type]);

  return <i className={"w-[25px] text-center fa-solid fa-" + icon}></i>;
};
