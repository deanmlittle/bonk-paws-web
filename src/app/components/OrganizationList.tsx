"use client";
import React, { useEffect, useState } from "react";
import OrganizationCard from "./OrganizationCard";
import DonationHistory from "./donationHistory";
import { Organization } from "@/types";
import Modal from "@/app/components/Modal";
import { ShortOrganization } from "@/types";
import { Tooltip } from "react-tooltip";

const OrganizationList: React.FC<{}> = () => {
  const [modalOrganization, setModalOrganization] = React.useState<
    Organization | undefined
  >(undefined);
  const [isOpen, setIsOpen] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState("");
  const [wantReceipt, setWantReceipt] = useState(false);
  const [onlyAnon, setOnlyAnon] = useState(false);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);

  console.log(search);
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

  const filterOrganizations = (organizations: ShortOrganization[]) => {
    return organizations.filter((organization: ShortOrganization) => {
      const isSearchMatch =
        search.toLowerCase() === "" ||
        organization.name.toLowerCase().includes(search.toLowerCase());
      const isReceiptMatch = !wantReceipt || organization.isReceiptEnabled;
      const isAnonMatch = !onlyAnon || organization.allowsAnon;
      return isSearchMatch && isReceiptMatch && isAnonMatch;
    });
  };

  return (
    <>
      {modalOrganization && (
        <Modal
          organization={modalOrganization}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          wantReceipt={wantReceipt}
          onlyAnon={onlyAnon}
        />
      )}

      <div className="flex flex-nowrap w-full md:w-1/2 justify-center items-center mx-auto lg:px-20 px-6">
        <div className="w-full h-[50px] flex space-x-4 items-center">
          <input
            className="text-yellow-950 h-[50px] p-3 w-full rounded-l-xl bg-transparent bg-yellow-950 bg-opacity-[0.08] border-2 rounded-xl border-yellow-800 border-opacity-20 focus:outline-none focus:border-yellow-700 transition ease-in placeholder:text-yellow-950"
            type="text"
            id="search"
            // autocomplete="off"
            placeholder="Search for Charities..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex h-full items-center justify-start w-[120px] gap-x-2">
            <Tooltip
              id="wantReceiptTooltip"
              arrowColor="transparent"
              style={{
                color: "white",
                borderRadius: 6,
                backgroundColor: "#000000",
              }}
            />
            <div
              data-tooltip-id="wantReceiptTooltip"
              data-tooltip-content="Require Receipt"
              className={`p-3 border-2 h-full cursor-pointer flex-shrink-0 hover:bg-opacity-20 rounded-xl bg-yellow-950 ${
                wantReceipt
                  ? "bg-opacity-10 border-2 border-red-500"
                  : "bg-opacity-[0.05] border-yellow-700 border-opacity-0"
              }`}
              onClick={() => setWantReceipt(!wantReceipt)}
            >
              <img
                src="/receipt.svg"
                alt="receipt"
                className="w-full h-full mx-auto"
              />
            </div>

            <Tooltip
              id="wantRemainAnonymous"
              arrowColor="transparent"
              style={{
                color: "white",
                borderRadius: 6,
                backgroundColor: "#000000",
              }}
            />
            <div
              data-tooltip-id="wantRemainAnonymous"
              data-tooltip-content="Remain Anonymous"
              className={`p-3 border-2 h-full cursor-pointer flex-shrink-0 hover:bg-opacity-20 rounded-xl bg-yellow-950 ${
                onlyAnon
                  ? "bg-opacity-10 border-2 border-red-500"
                  : "bg-opacity-[0.05] border-yellow-700 border-opacity-0"
              }`}
              onClick={() => setOnlyAnon(!onlyAnon)}
            >
              <img
                src="/anonymous.svg"
                alt="receipt"
                className="w-full h-full mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        id="charities"
        className="grid grid-cols-1 mt-20 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-20"
      >
        {filterOrganizations(organizations)
          .slice(0, visibleCount)
          .map((organization) => (
            <OrganizationCard
              key={organization["id"]}
              organization={organization}
              onClick={() => {
                setModalOrganization(organization);
                setIsOpen(true);
              }}
            />
          ))}
      </div>
      {filterOrganizations(organizations).length > visibleCount && (
        <div className="w-full mt-10 flex space-x-4 items-center justify-center">
          <div className="h-[1px] w-full bg-yellow-700 bg-opacity-30"></div>
          <button
            onClick={() => setVisibleCount(visibleCount + 12)}
            className="w-full md:w-64 flex items-center justify-center bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded transition ease-in cursor-pointer"
          >
            Load More
          </button>
          <div className="h-[1px] w-full bg-yellow-700 bg-opacity-30"></div>
        </div>
      )}
    </>
  );
};

export default OrganizationList;
