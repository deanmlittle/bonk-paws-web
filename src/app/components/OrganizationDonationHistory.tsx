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
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Connection } from "@solana/web3.js";

interface OrganizationDonationHistoryProps {
  id: number;
}

const preflightCommitment = "processed";
const commitment = "processed";

export default function OrganizationDonationHistory({
  id,
}: OrganizationDonationHistoryProps) {
  const [donationHistory, setDonationHistory] = useState<
    { donationAmount: number; date: Date; donor: String; id: String }[]
  >([]);
  const connection = new Connection(RPC_URL);
  const wallet = useAnchorWallet();

  useEffect(() => {
    const getDonationHistory = async () => {
      if (wallet) {
        try {
          const provider = new AnchorProvider(connection, wallet, {
            preflightCommitment,
            commitment,
          });

          const program = new Program(IDL, PROGRAM_ID!, provider);

          let idBuf = Buffer.allocUnsafe(8);
          idBuf.writeBigUInt64LE(BigInt(id));
          let bytes = bs58.encode(idBuf);

          let fetchedHistory = await program.account.donationHistory.all([
            {
              memcmp: {
                offset: 40,
                bytes,
              },
            },
          ]);
          const history = fetchedHistory.map((item) => ({
            donationAmount: item.account.donationAmount.toNumber(),
            date: new Date(item.account.timestamp.toNumber() * 1000),
            donor: item.account.donor.toBase58(),
            id: item.account.id.toString(),
          }));
          setDonationHistory(history);
        } catch (e) {
          console.error(e);
          setDonationHistory([]);
        }
      }
    };
    getDonationHistory();
  }, [wallet]);

  return (
    <div className="relative w-full my-6 mx-auto">
      <div className="rounded-lg border bg-bonk-white border-bonk-orange relative flex flex-col w-full outline-none focus:outline-none">
        <div className="relative p-6 flex-auto">
          <div className="flex flex-col gap-y-0">
            <p className="text-yellow-600 mb-2 font-semibold">
              Transaction History
            </p>

            <div className="flex flex-col border items-center border-slate-300 rounded-lg divide-y divide-y-slate-300">
              {donationHistory.length === 0 ? (
                <p className="text-slate-700 text-md py-6 font-mono">
                  No donations yet!
                </p>
              ) : (
                donationHistory.map((donation) => {
                  return (
                    <div
                      key={donation.id.toString()}
                      className="flex justify-between items-center w-full p-3"
                    >
                      <div className="flex items-start flex-col">
                        <span className="text-slate-700 font-semibold">
                          {donation.donor}
                        </span>
                        <span className="text-slate-400 text-sm">
                          {donation.date.toDateString()}
                        </span>
                      </div>
                      <span className="font-semibold text-yellow-950 flex space-x-2">
                        <Image
                          className="mr-1 w-5 my-auto"
                          src="/sol.png"
                          alt="SOL"
                          width={16}
                          height={16}
                        />
                        <span>
                          {(donation.donationAmount / 1e9).toLocaleString()}
                        </span>
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
  );
}
