"use client";
import DonationWidget from "@/app/components/DonationWidget";
import { APP_URL } from "@/constants";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type DonateProps = {
  params: {
    id: string;
  };
};

export default function Donate({ params }: DonateProps) {
  const [currentOrg, setCurrentOrg] = useState<any>(null);
  useEffect(() => {

    const getCharityInfo = async () => {
      try {
        const res = await fetch(
          APP_URL + `/api/organization?id=${params.id}`
        );
        const json = await res.json();
        setCurrentOrg(json?.data?.data?.organization); 
        return json;
      } catch (err) {
        console.log(err);
      }
    };
    getCharityInfo();
  }, []);

  return (
    <main className="flex min-h-screen flex-col mt-8">
      <div className="relative isolate px-6 pt-0 lg:px-8 mt-16 h-full">
        {currentOrg && (
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-5 gap-y-10 lg:gap-16">
            <div className="col-span-3 flex flex-col">
              <h1 className="mt-5 font-bold tracking-tighter text-4xl py-4 text-yellow-950">
                {currentOrg.name}
              </h1>
              <p className="text-xl text-yellow-800 font-medium">
                {currentOrg.websiteBlocks?.missionStatement?.value}
              </p>
              <div className="flex gap-x-4 mt-10">
                {currentOrg.isReceiptEnabled && (
                  <div className="flex items-center gap-x-2">
                    <img src="/receipt.svg" alt="receipt" />
                    Receipt Available
                  </div>
                )}
                {currentOrg.allowsAnon && (
                  <div className="flex items-center gap-x-2">
                    <img src="/anonymous.svg" alt="receipt" />
                    Allows Anonymous Donations
                  </div>
                )}
              </div>
              <div className="mt-10 w-full h-[60vh] flex items-center justify-center relative rounded-xl overflow-hidden">
                <img
                  className="lg:w-1/3 mx-auto z-10 relative rounded-lg"
                  src={currentOrg.logo}
                  alt={currentOrg.name}
                />
                <img
                  className="absolute top-0 w-full mx-auto rounded-lg blur-[50px] brightness-100 scale-125"
                  src={currentOrg.logo}
                  alt={currentOrg.name}
                />
              </div>
            </div>
            <div className="col-span-2 w-full h-full custom-orange-bg border border-yellow-300 transition-all rounded-lg">
              <DonationWidget organization={currentOrg} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
