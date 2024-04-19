import React, { useEffect, useState } from "react";
import { IDL } from "../../idl";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import {
  useWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import Image from "next/image";
import { PROGRAM_ID, RPC_URL } from "@/constants";
import { organizations } from "@/animal-charities";
import { Connection } from "@solana/web3.js";

interface DonationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const preflightCommitment = "processed";
const commitment = "processed";

export default function DonationHistory({ isOpen, setIsOpen }: DonationProps) {
  const { publicKey } = useWallet();
  const [donationHistory, setDonationHistory] = useState<
    { id: number; organization?: any; donationAmount: number; date: Date }[]
  >([]);
  const connection = new Connection(RPC_URL);
  const wallet = useAnchorWallet();

  useEffect(() => {
    const getDonationHistory = async () => {
      if (publicKey && wallet) {
        try {
          const provider = new AnchorProvider(connection, wallet, {
            preflightCommitment,
            commitment,
          });

          const program = new Program(IDL, PROGRAM_ID!, provider);

          let fetchedHistory = await program.account.donationHistory.all([
            {
              memcmp: {
                offset: 8,
                bytes: publicKey.toBase58(),
              },
            },
          ]);
          const history = fetchedHistory.map((item) => ({
            id: item.account.id.toNumber(),
            organization: organizations.find((o) => o.id === item.account.id.toNumber()),
            donationAmount: item.account.donationAmount.toNumber(),
            date: new Date(item.account.timestamp.toNumber()*1000)
          }));
          setDonationHistory(history);
        } catch (e) {
          console.error(e);
          setDonationHistory([]);
        }
      }
    };
    getDonationHistory();
  }, [wallet, publicKey]);

  return (
    <>
      {isOpen && publicKey ? (
        <div className="justify-center text-black items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative max-w-md w-full my-6 mx-auto z-10">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex flex-col text-center p-5 border-b border-solid border-blueGray-200 rounded-t relative">
                <span className="text-slate-600 mb-2 font-semibold">
                  Donation History!
                </span>
                <button
                  className="absolute right-4 top-4 text-xl"
                  onClick={() => setIsOpen(false)}
                >
                  &times;
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <div className="flex flex-col gap-y-0 mb-4">
                  <p className="text-black mb-2 font-semibold">
                    User Publickey
                  </p>
                  <p className="text-slate-700 mb-1 text-sm w-full truncate">
                    {publicKey.toString()}
                  </p>
                </div>
                <div className="flex flex-col gap-y-0">
                  <p className="text-black mb-2 font-semibold">
                    Transaction History
                  </p>

                  <div className="flex justify-between items-center w-full py-2">
                    <span className="text-slate-700 text-sm">
                      Organization
                    </span>
                    <span className="flex items-center gap-x-1 text-slate-700 text-sm pr-3">
                      <Image
                        src="/sol.png"
                        width={16}
                        height={16}
                        alt="SOL"
                        className="w-5"
                      />
                      Amount
                    </span>
                  </div>

                  <div className="flex flex-col border items-center border-slate-300 rounded-lg divide-y divide-y-slate-300">
                    {donationHistory.length === 0 ? (
                      <p className="text-slate-700 text-md py-6">
                        No donations yet!
                      </p>
                    ) : (
                      donationHistory.map((donation) => {
                        const { organization } = donation || undefined;
                        return (
                          <div
                            key={donation.id.toString()}
                            className="flex justify-between items-center w-full p-3"
                          >
                            <div className="flex items-center space-x-1">
                              {organization && organization.logo && (
                                <img
                                  src={
                                    organization ? organization.logo : null
                                  }
                                  className="w-5 h-5"
                                  alt="Organization Logo"
                                />
                              )}
                              <span className="text-slate-700">
                                {organization
                                  ? organization.name
                                  : "Unknown Org"}
                              </span>
                            </div>
                            <span className="font-semibold text-yellow-950">
                              {(donation.donationAmount/1e9).toLocaleString()}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div onClick={() => { setIsOpen(false) }} className="opacity-25 fixed inset-0 bg-black"></div>
        </div>
      ) : null}
    </>
  );
};