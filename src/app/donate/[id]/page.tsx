"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Donate({ params }) {
  const router = useRouter();
  console.log(params.id);
  const [organizations, setOrganizations] = useState([]);
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
  }, []);

  return (
    <main className="flex min-h-screen flex-col mt-8">
      <div className="relative mx-auto max-w-xl isolate px-6 pt-0 lg:px-8">
        <div className="mx-auto py-32 sm:py-0 lg:py-20">
          {orgPage && (
            <div className="w-full hover:cursor-pointer custom-orange-bg border border-yellow-300 p-4 transition-all rounded-lg">
              <div className="w-full flex flex-col wh-full text-center border-top border-left border-right border-yellow-400 rounded-lg transition-all">
                <div className="border-b border-orange-100 h-48 bg-white rounded-lg w-90">
                  <img
                    className="object-contain h-48 w-96 py-5"
                    width={320}
                    height={180}
                    src={orgPage.logo}
                    alt={orgPage.name}
                  />
                </div>
                <div className="px-6 py-4 flex flex-col h-full">
                  <div className="font-bold tracking-tighter text-xl mb-10 text-yellow-950">
                    {orgPage.name}
                  </div>
                  <div className="flex flex-col space-y-4">
                    {orgPage.isReceiptEnabled && (
                      <div className="flex items-center gap-x-2">
                        <img src="/receipt.svg" alt="receipt" />
                        Receipt Provided
                      </div>
                    )}
                    {orgPage.allowsAnon && (
                      <div className="flex items-center gap-x-2">
                        <img src="/anonymous.svg" alt="receipt" />
                        Allows Anonymous Donations
                      </div>
                    )}
                  </div>
                  <button className="bg-red-500 hover:bg-red-400 text-white font-bold mt-10 py-2 px-4 rounded">
                    Donate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
