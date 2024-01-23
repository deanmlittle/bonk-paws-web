import { Organization } from "@/types";
import React, { useEffect, useState } from "react";
import { getDonate, getMatchAndFinalize } from "../../../api/program";
import axios from "axios";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { Connection, PublicKey, Transaction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

interface ModalProps {
  organization?: Organization;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ organization, isOpen, setIsOpen }) => {
  const [quoteLoading, setQuoteloading] = React.useState(false);
  const [quoteAmount, setQuoteAmount] =useState<number>(0);
  const [fromAmount, setFromAmount] = useState<number>(0);

  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const wallet = useWallet();
  
  const getSwapQuote = async (amount: number) => {
    if(!quoteLoading) {
      setQuoteloading(true);
      try {
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
  const {signatureIx, donateIx, charityWallet2, matchDonationState} = await getDonate(organization.id, fromAmount, new PublicKey(publicKey));
  const tx = new Transaction().add(signatureIx).add(donateIx);
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  const signedTx = await wallet.signTransaction(tx);
  const signature = await connection.sendRawTransaction(
      signedTx.serialize(),
      {
          skipPreflight: false,
      }
  );
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
  }

  if (fromAmount >= 1 && matchDonationState) {
    const matchAndFinalizeSignature = await matchAndFinalize(charityWallet2, matchDonationState);
    return signature && matchAndFinalizeSignature;
  } else {
    return signature;
  }
};

const matchAndFinalize = async (charityWallet2: PublicKey, matchDonationState: PublicKey) => {
      const {matchIx, swapIx, finalizeIx, addressLookupTableAccounts} = await getMatchAndFinalize(fromAmount, charityWallet2, matchDonationState);
      const connection = new Connection("https://api.mainnet-beta.solana.com");
      const blockhash = (await connection.getLatestBlockhash()).blockhash;
      const messageV0 = new TransactionMessage({
          payerKey: authority.publicKey,
          recentBlockhash: blockhash,
          instructions: [
            matchIx,
            swapIx,
            finalizeIx,
          ],
      }).compileToV0Message(addressLookupTableAccounts);
      const tx = new VersionedTransaction(messageV0);
      tx.sign([authority]);

      const signedTx = await wallet.signTransaction(tx);
      const signature = await connection.sendRawTransaction(
          signedTx.serialize(),
          {
              skipPreflight: false,
          }
      );
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
  }

}
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