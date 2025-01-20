"use client";
import { useEffect, useState } from "react";

export const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="w-full bg-beige p-4 mt-3 z-0">
      <ul
        className={
          "flex gap-3 w-full items-center justify-center " +
          (isMobile ? "flex-col" : "")
        }
      >
        <li>Plan du site</li>
        <li>Mentions légales</li>
        <li>Confidentialité</li>
      </ul>
    </div>
  );
};
