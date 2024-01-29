"use client";
import DonationWidget from "@/app/components/DonationWidget";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Donate({ params }) {
  const [organizations, setOrganizations] = useState([]);
  const [currentOrg, setCurrentOrg] = useState(null);
  const orgPage = organizations.find((org) => params.id === org.id.toString());
  useEffect(() => {
    const getAnimalCharityList = async () => {
      try {
        const res = await fetch("/json/animal-charities.json");
        const json = await res.json();

        setOrganizations(json);
        return json;
      } catch (err) {
        console.log(err);
      }
    };
    getAnimalCharityList();

    const getCharityInfo = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/organization?id=${params.id}`
        );
        console.log(res);
        // const json = await res.json();

        // setCurrentOrg(json);
        // return json;
      } catch (err) {
        console.log(err);
      }
    };
    getCharityInfo();
  }, []);

  return (
    <main className="flex min-h-screen flex-col mt-8">
      <div className="relative isolate px-6 pt-0 lg:px-8 mt-16 h-full">
        {orgPage && (
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-5 gap-y-10 lg:gap-16">
            <div className="col-span-3 flex flex-col">
              <h1 className="mt-5 font-bold tracking-tighter text-4xl py-4 text-yellow-950">
                {orgPage.name}
              </h1>
              <p className="text-xl text-yellow-800 font-medium">
                Help the ROLDA Rescue Team to transform life for injured dogs
                like Babette
              </p>
              <div className="flex gap-x-4 mt-10">
                {orgPage.isReceiptEnabled && (
                  <div className="flex items-center gap-x-2">
                    <img src="/receipt.svg" alt="receipt" />
                    Receipt Available
                  </div>
                )}
                {orgPage.allowsAnon && (
                  <div className="flex items-center gap-x-2">
                    <img src="/anonymous.svg" alt="receipt" />
                    Allows Anonymous Donations
                  </div>
                )}
              </div>
              <div className="mt-10 w-full h-[60vh] flex items-center justify-center relative rounded-xl overflow-hidden">
                <img
                  className="lg:w-1/3 mx-auto z-10 relative rounded-lg"
                  src={orgPage.logo}
                  alt={orgPage.name}
                />
                <img
                  className="absolute top-0 w-full mx-auto rounded-lg blur-[50px] brightness-100 scale-125"
                  src={orgPage.logo}
                  alt={orgPage.name}
                />
              </div>
            </div>
            <div className="col-span-2 w-full h-full custom-orange-bg border border-yellow-300 transition-all rounded-lg">
              <div className="h-full w-full flex flex-col text-center border-top border-left border-right border-yellow-400 rounded-lg transition-all">
                <div className="px-2 py-4 flex flex-col h-full">
                  <DonationWidget
                    organization={orgPage}
                    wantReceipt={true}
                    onlyAnon={false}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
