import React, { useEffect, useState } from "react";
import { getDonate, IDL, getMatchAndFinalize } from "../../../api/program";
import axios from "axios";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { Address, AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey, Transaction, TransactionMessage, VersionedTransaction, Keypair } from "@solana/web3.js";
import { useWallet, useAnchorWallet, useConnection} from '@solana/wallet-adapter-react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

interface DonationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const preflightCommitment = "processed";
const commitment = "processed";
const PROGRAM_ID = "4p78LV6o9gdZ6YJ3yABSbp3mVq9xXa4NqheXTB1fa4LJ";

const DonationHistory: React.FC<DonationProps> = ({isOpen, setIsOpen }) => {
  const {connection} = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();

  if (!wallet) return
  if (!publicKey) throw new WalletNotConnectedError();

  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment,
    commitment,
  });

  const program = new Program(IDL, PROGRAM_ID, provider);

  
//   const donationHistory = async (amount: number) => {
//       try {
//         setQuoteAmount((quote.inAmount));
//       } catch(e) {
//         console.error(e);
//         setQuoteAmount(0);
//       }
//     }
//   }

  return (
    <>
      {isOpen ? (
        <>
            <div className="justify-center text-black items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none" >
                <div className="relative max-w-sm w-full my-6 mx-auto">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex flex-col text-center p-5 border-b border-solid border-blueGray-200 rounded-t relative">
                            <span className="text-slate-600 mb-2 font-semibold">Donation History!</span>
                            <button className="absolute right-4 top-4 text-xl" onClick={() => setIsOpen(false)}>&times;</button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto">
                        <div className="flex flex-col gap-y-0">
                                <p className="text-slate-700 mb-1 text-sm">User Publickey</p>
                                <p className="text-slate-700 mb-1 text-sm">{publicKey.toString()}</p>
                            </div>
                            <div className="flex flex-col gap-y-0">
                                <p className="text-slate-700 mb-1 text-sm">Transaction History</p>
                                <div className="flex border items-center border-slate-200 py-2 rounded-xl">
                                    {/* Put a transaction history card: Id - Amount */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
     ) : null}
     </>
   );
};

export default DonationHistory;