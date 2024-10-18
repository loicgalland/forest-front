"use client";

import { useEffect, useState } from "react";
import HostingRepository from "@/app/repository/HostingRepository";
import { Card } from "@/app/components/Card";
import { Hero } from "@/app/components/Hero";
import { HostingInterface } from "@/app/interface/Hosting.interface";

export default function Home() {
  const [hostings, setHostings] = useState<HostingInterface[]>([]);

  const fetchData = async (): Promise<{
    data: { data: HostingInterface[]; success: boolean };
  }> => {
    try {
      return await HostingRepository.getSpotlight();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData().then((response) => {
      if (response && response.data) {
        console.log(response.data);
        setHostings(response.data.data);
      }
    });
  }, []);

  return (
    <div>
      <div className="mb-5">
        <Hero
          title="Titre du site"
          image="https://picsum.photos/200/300?grayscale"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
      </div>
      {hostings && hostings.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mb-2">Nos coups de cœur</h2>
          <div className="flex gap-3 flex-wrap">
            {hostings.map((item) => {
              return <Card key={item._id} hosting={item} type="hosting" />;
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
