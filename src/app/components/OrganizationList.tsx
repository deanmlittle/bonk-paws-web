"use client";
import React, { useEffect, useState } from "react";
import OrganizationCard from "./OrganizationCard";
// import DonationHistory from "./DonationHistory";
import { Organization } from "@/types";
import Modal from "@/app/components/Modal";
import { ShortOrganization } from "@/types";
import { Tooltip } from "react-tooltip";
import { motion } from "framer-motion";
import AnonymousSvg from "../../../public/anonymous.svg";

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

  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  // const [address1, setAddress1] = useState("");
  // const [address2, setAddress2] = useState("");
  // const [country, setCountry] = useState("");
  // const [state, setState] = useState("");
  // const [city, setCity] = useState("");
  // const [zipCode, setZipCode] = useState("");
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full h-[50px] flex space-x-4 items-center justify-center"
        >
          <input
            className="text-bonk-orange h-[50px] p-3 w-full rounded-l-xl bg-transparent bg-bonk-orange bg-opacity-[0.08] border-2 rounded-xl border-bonk-orange border-opacity-20 focus:outline-none focus:border-bonk-orange transition ease-in placeholder:text-bonk-orange placeholder:font-herborn"
            type="text"
            id="search"
            autoComplete="off"
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
              className={`p-3 h-full cursor-pointer flex-shrink-0 rounded-xl text-bonk-orange duration-300 transition-all ${
                wantReceipt
                  ? "bg-bonk-orange text-bonk-white"
                  : "bg-bonk-orange/10"
              }`}
              onClick={() => setWantReceipt(!wantReceipt)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
                <path d="M14 8H8"></path>
                <path d="M16 12H8"></path>
                <path d="M13 16H8"></path>
              </svg>
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
              className={`p-3 h-full cursor-pointer flex-shrink-0 rounded-xl text-bonk-orange duration-300 transition-all ${
                onlyAnon
                  ? "bg-bonk-orange text-bonk-white"
                  : "bg-bonk-orange/10"
              }`}
              onClick={() => setOnlyAnon(!onlyAnon)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      <div
        id="charities"
        className="grid grid-cols-1 mt-20 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-20"
      >
        {filterOrganizations(organizations)
          .slice(0, visibleCount)
          .map((organization, index) => (
            <motion.div
              key={organization.id.toString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 * index }}
              className="h-full"
            >
              <OrganizationCard
                organization={organization}
                onClick={() => {
                  setModalOrganization(organization);
                  setIsOpen(true);
                }}
              />
            </motion.div>
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
