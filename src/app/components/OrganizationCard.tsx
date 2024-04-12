"use client";

import { Organization } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const OrganizationCard: React.FC<{
  organization: Organization;
  onClick: (organization: Organization) => void;
}> = ({ organization, onClick }) => {
  const [isReady, setIsReady] = useState(false);
  const route = useRouter();
  return (
    <div
      className="h-full hover:scale-105 hover:cursor-pointer bg-bonk-white text-bonk-orange border p-4 transition-all rounded-lg shadow hover:shadow-bonk-orange hover:shadow-lg font-herborn"
      onClick={() => {
        route.push(`/donate/${organization.slug}`);
      }}
    >
      <div className="col-span-1 flex flex-col h-full text-center border-top border-left rounded-lg transition-all">
        <div className="h-48 bg-white rounded-lg w-90 shadow-md">
          <img
            className="object-contain h-48 w-96 py-5"
            width={320}
            height={180}
            src={organization.logo}
            alt={organization.name}
          />
        </div>
        <div className="px-6 py-4 flex flex-col h-full">
          <div className="font-bold tracking-tighter text-xl mb-10">
            {organization.name}
          </div>
          <button className="bg-bonk-orange hover:opacity-75 duration-300 transition-all text-white font-bold mt-auto py-2 px-4 rounded">
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;
