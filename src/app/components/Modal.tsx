import { Organization } from "@/types";
import React, { useEffect, useState } from "react";
import { getDonate, IDL, getMatchAndFinalize } from "../../../api/program";
import axios from "axios";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { Address, AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey, Transaction, TransactionMessage, VersionedTransaction, Keypair } from "@solana/web3.js";
import { useWallet, useAnchorWallet, useConnection} from '@solana/wallet-adapter-react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

interface ModalProps {
  organization: Organization;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const preflightCommitment = "processed";
const commitment = "processed";
const PROGRAM_ID = "4p78LV6o9gdZ6YJ3yABSbp3mVq9xXa4NqheXTB1fa4LJ";

const Modal: React.FC<ModalProps> = ({ organization, isOpen, setIsOpen }) => {
  const [quoteLoading, setQuoteloading] = React.useState(false);
  const [quoteAmount, setQuoteAmount] =useState<number>(0);
  const [fromAmount, setFromAmount] = useState<number>(0);

  const {connection} = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();

  if(!wallet) return
  if (!publicKey) throw new WalletNotConnectedError();

  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment,
    commitment,
  });

  const program = new Program(IDL, PROGRAM_ID, provider);

  
  const getSwapQuote = async (amount: number) => {
    if(!quoteLoading) {
      setQuoteloading(true);
      try {
        amount = amount * 10_000
        const { data: quote } = await axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263&outputMint=So11111111111111111111111111111111111111112&amount=${amount}&swapMode=ExactOut&slippageBps=50`);
        setQuoteAmount((quote.inAmount));
        setQuoteloading(false);
      } catch(e) {
        console.error(e);
        setQuoteAmount(0);
        setQuoteloading(false);
      }
    }
  }

  const updateFromAmount = async(amount: number) => {
    setFromAmount(amount);
    await getSwapQuote(amount*1e4);
  }

const donate = async () => {
  const {txIx, donateIx, charityWallet2, matchDonationState} = await getDonate(organization.id, fromAmount, new PublicKey(publicKey), program);
  const tx = new Transaction().add(txIx).add(donateIx);
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  const signature = await sendTransaction(tx, connection,{skipPreflight:true});
  const result = await connection.confirmTransaction(
      {
          signature,
          blockhash,
          lastValidBlockHeight,
      },
      `confirmed`
  );
  if (result && result.value && result.value.err) {
      throw Error(JSON.stringify(result.value.err));
  };


  if (fromAmount >= 0 && matchDonationState) {
    // const matchAndFinalizeSignature = await matchAndFinalize(charityWallet2, matchDonationState);
    // fetch to avoid using env
    const data =  {
      fromAmount:fromAmount,
      charityWallet2:charityWallet2,
      matchDonationState:matchDonationState
    }
    const data_json = JSON.stringify(data);
    console.log(data_json);
    const matchAndFinalizeoptions = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      };
    const res = await fetch("http://localhost:3000/api/matchFinaliseIx", matchAndFinalizeoptions);
    

    if (!res.ok) {
      throw new Error("Failed to create with match and finalise");
    } 
    const matchAndFinalizeSignature = await res.json();
    return signature && matchAndFinalizeSignature;
  } else {
    return signature;
  }
};

// const matchAndFinalize = async (charityWallet2: PublicKey, matchDonationState: PublicKey) => {
//       const {matchIx, swapIx, finalizeIx, addressLookupTableAccounts} = await getMatchAndFinalize(fromAmount, charityWallet2, matchDonationState, program);
//       const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
//       const messageV0 = new TransactionMessage({
//           payerKey: AUTH_WALLET.publicKey,
//           recentBlockhash: blockhash,
//           instructions: [
//             matchIx,
//             swapIx,
//             finalizeIx,
//           ],
//       }).compileToV0Message(addressLookupTableAccounts);
//       const transaction = new VersionedTransaction(messageV0);
//       transaction.sign([AUTH_WALLET]);

//       const txid = await connection.sendTransaction(transaction, {skipPreflight:true});

// }
  return (
    <>
      {organization && isOpen ? (
        <>
          <div
            className="justify-center text-black items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative max-w-sm w-full my-6 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex flex-col text-center p-5 border-b border-solid border-blueGray-200 rounded-t relative">
                  <span className="text-slate-600 mb-2">Donating To</span>
                  <h3 className="text-xl text-center mx-auto font-semibold">
                    {organization.name}
                  </h3>
                  <button className="absolute right-4 top-4 text-xl" onClick={() => setIsOpen(false)}>&times;</button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">

                  <div className="flex flex-col gap-y-0">
                  <p className="text-slate-700 mb-1 text-sm">Donation Amount</p>
                  <div className="flex border items-center border-slate-200 py-2 rounded-xl">
                    <input name="fromForm" type="number" className="bg-transparent ml-3 font-raleway text-slate-900 font-regular !outline-none" value={fromAmount} onChange={(e) => {updateFromAmount(parseFloat(e.target.value))}}
                      placeholder="Amount"
                      style={{ flex: 1 }}
                      min="0.01" />
                    <img className="w-6 h-6 mr-2" src="sol.png" />
                  </div>

                  <p className="text-slate-700 text-sm mb-1 mt-4">Our Match</p>
                  <div className="flex items-center border border-slate-200 py-2 rounded-xl">
                    <p className="bg-transparent ml-3 font-raleway text-slate-900 font-regular !outline-none" style={{ flex: 1 }}>
                      {fromAmount >= 1 ? quoteAmount : 0}
                    </p>
                    <img className="w-6 h-6 mr-2" src="logo.png" />
                  </div>

                  <p className="text-slate-700 text-sm mb-1 mt-4">Burn Amount</p>
                  <div className="flex items-center border border-slate-200 py-2 rounded-xl">
                    <p className="bg-transparent ml-3 font-raleway text-slate-900 font-regular !outline-none" style={{ flex: 1 }}>
                      {fromAmount >= 1 ? quoteAmount*0.01 : 0}
                      </p>
                    <img className="w-6 h-6 mr-2" src="logo.png" />
                  </div>

                  <p className="text-slate-700 text-sm mb-1 mt-4">Charity Receives</p>
                  <div className="flex border items-center border-slate-200 py-2 rounded-xl">
                    <p className="bg-transparent ml-3 font-raleway text-slate-900 font-regular !outline-none" style={{ flex: 1 }}>
                      {fromAmount >= 1 ? fromAmount * 2 : fromAmount}
                      </p>
                    <img className="w-6 h-6 mr-2" src="sol.png" />
                  </div>
                  <div className="flex items-center justify-between mt-4 w-full">
                      <button
                        className={`bg-red-500 hover:bg-red-400 text-white font-semibold w-full py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline ${quoteLoading || fromAmount === 0 ? 'opacity-20' : ''}`}
                        type="button"
                        disabled={fromAmount === 0 || quoteLoading}
                        onClick={donate}
                      >
                        Donate
                      </button>
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
}

export default Modal;