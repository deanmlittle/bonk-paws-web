import { Organization } from "@/types";
import React, { useEffect, useState } from "react";
// import { getDonate, IDL, getMatchAndFinalize } from "../../../api/program";
import axios from "axios";
import { Address, AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
  Keypair,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionInstructionCtorFields,
  Ed25519Program,
} from "@solana/web3.js";
import {
  useWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  APP_URL,
  PROGRAM_ID,
  PROGRAM_ID_PUBKEY,
  matchAmount,
  maxMatchAmount,
} from "@/constants";
import { IDL } from "@/idl";
import { randomBytes } from "crypto";
import Loader from "./Loader";

interface WidgetProps {
  organization: Organization;
}

const preflightCommitment = "processed";
const commitment = "processed";

const DonationWidget: React.FC<WidgetProps> = ({ organization }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState("");
  const [quoteLoading, setQuoteloading] = React.useState(false);
  const [quoteAmount, setQuoteAmount] = useState<number>(0);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [wantReceipt, setWantReceipt] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [receiptEmail, setReceiptEmail] = useState("");
  const [addressLine1, setaddressLine1] = useState("");
  const [addressLine2, setaddressLine2] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();

  if (!wallet)
    return (
      <div className="bg-bonk-white border border-bonk-orange mt-6 transition-all rounded-lg w-full flex flex-col text-center p-8">
        <p className="italic text-bonk-orange font-mono">
          Connect your wallet to make a donation
        </p>
      </div>
    );
  if (!publicKey) throw new WalletNotConnectedError();

  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment,
    commitment,
  });

  const program = new Program(IDL, PROGRAM_ID, provider);

  const getSwapQuote = async (amount: number) => {
    if (amount < matchAmount || isNaN(amount)) return;
    if (!quoteLoading) {
      setQuoteloading(true);
      try {
        // amount = amount * 10_000;
        const { data: quote } = await axios.get(
          `https://quote-api.jup.ag/v6/quote?inputMint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263&outputMint=So11111111111111111111111111111111111111112&amount=${amount}&swapMode=ExactOut&slippageBps=50`
        );
        setQuoteAmount(quote.inAmount);
        setQuoteloading(false);
      } catch (e) {
        console.error(e);
        setQuoteAmount(0);
        setQuoteloading(false);
      }
    }
  };

  const updateFromAmount = async (amount: number) => {
    setFromAmount(Number(amount));
    await getSwapQuote(Number(amount * 1e4));
  };

  const viewTx = async () => {
    window.open(
      `https://explorer.solana.com/tx/${signature}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const donate = async () => {
    setIsLoading(true);
    try {
      const data = {
        organizationId: organization.id,
        isAnonymous,
        pledgeCurrency: "SOL",
        pledgeAmount: fromAmount.toString(),
        receiptEmail,
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        country,
        state,
        city,
        zipcode,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const res = await (
        await fetch(APP_URL + `/api/payment?id=${organization.id}`, options)
      ).json();
      const seed = new BN(randomBytes(8));
      const charity = new PublicKey(res.data.donationAddress);
      // const matchAddress = new PublicKey(res.data.matchAddress);
      const signatureIxFields: TransactionInstructionCtorFields = {
        keys: [],
        programId: Ed25519Program.programId,
        data: Buffer.from(res.data.signatureIx.data.data),
      };
      const signatureIx = new TransactionInstruction(signatureIxFields);
      console.log(signatureIx);
      const donationState = PublicKey.findProgramAddressSync(
        [Buffer.from("donation_state")],
        PROGRAM_ID_PUBKEY
      )[0];
      const matchDonationState = PublicKey.findProgramAddressSync(
        [Buffer.from("match_donation"), seed.toArrayLike(Buffer, "le", 8)],
        PROGRAM_ID_PUBKEY
      )[0];
      const donationHistory = PublicKey.findProgramAddressSync(
        [
          Buffer.from("donation_history"),
          seed.toArrayLike(Buffer, "le", 8),
          publicKey.toBuffer(),
        ],
        PROGRAM_ID_PUBKEY
      )[0];

      let amount = new BN(fromAmount * 1e9);
      const donateIx = await program.methods
        .donate(seed, amount)
        .accounts({
          donor: publicKey,
          charity,
          donationState,
          matchDonationState,
          donationHistory,
          instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      let tx = new Transaction().add(signatureIx).add(donateIx);
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;
      const sig = await sendTransaction(tx, connection, {
        skipPreflight: true,
      });
      const result = await connection.confirmTransaction(
        {
          signature: sig,
          blockhash,
          lastValidBlockHeight,
        },
        `confirmed`
      );
      if (result && result.value && result.value.err) {
        throw Error(JSON.stringify(result.value.err));
      }
      setSignature(sig);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }

    // if (fromAmount >= 0 && matchDonationState) {
    //   const data = {
    //     fromAmount: fromAmount,
    //     charityWallet2: charityWallet2,
    //     matchDonationState: matchDonationState,
    //   };
    //   const data_json = JSON.stringify(data);
    //   console.log(data_json);
    //   const matchAndFinalizeoptions = {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   };
    //   const res = await fetch(
    //     "http://localhost:3000/api/matchFinaliseIx",
    //     matchAndFinalizeoptions
    //   );

    //   if (!res.ok) {
    //     throw new Error("Failed to create with match and finalise");
    //   }
    //   const matchAndFinalizeSignature = await res.json();
    //   return signature && matchAndFinalizeSignature;
    // } else {
    //   return signature;
    // }
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
      {organization ? (
        <>
          <div className="bg-bonk-white border border-bonk-orange mt-6 transition-all rounded-lg w-full flex flex-col text-center p-8">
            <div className="justify-center text-black items-center flex overflow-x-hidden inset-0 z-50 outline-none focus:outline-none h-full">
              <div className="relative w-full mx-auto h-full">
                <div className="relative flex flex-col items-start w-full ">
                  <p className="text-bonk-orange mb-1 text-sm">
                    Donation Amount
                  </p>
                  <div className="flex w-full justify-between border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl">
                    <input
                      name="fromForm"
                      type="number"
                      className="w-full bg-transparent ml-3 font-raleway text-bonk-orange font-regular !outline-none placeholder:text-bonk-orange"
                      value={fromAmount}
                      onChange={(e) => {
                        updateFromAmount(parseFloat(e.target.value));
                      }}
                      placeholder="Amount"
                      min="0.01"
                    />
                    <img className="w-6 h-6 mr-2" src="/sol.png" />
                  </div>

                  <p className="text-bonk-orange text-sm mb-1 mt-4">
                    Our Match
                  </p>
                  <div className="flex w-full items-center border border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl">
                    <p className="w-full text-start bg-transparent ml-3 font-raleway text-bonk-orange font-regular !outline-none">
                      {fromAmount >= matchAmount
                        ? Number(
                            Math.min(maxMatchAmount, fromAmount)
                          ).toLocaleString()
                        : 0}
                    </p>
                    <img className="w-6 h-6 mr-2" src="/sol.png" />
                  </div>

                  <p className="text-bonk-orange text-sm mb-1 mt-4">
                    Burn Amount
                  </p>
                  <div className="flex w-full items-center border border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl">
                    <p className="w-full text-start bg-transparent ml-3 font-raleway text-bonk-orange font-regular !outline-none">
                      {fromAmount >= 0
                        ? Number(quoteAmount * 0.01).toLocaleString()
                        : 0}
                    </p>
                    <img className="w-6 h-6 mr-2" src="/logo.png" />
                  </div>
                  <p className="text-bonk-orange text-sm mb-1 mt-4">
                    Charity Receives
                  </p>
                  <div className="flex w-full border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl mb-4">
                    <p className="w-full text-start bg-transparent ml-3 font-raleway text-bonk-orange font-regular !outline-none">
                      {fromAmount >= matchAmount
                        ? Number(
                            fromAmount + Math.min(maxMatchAmount, fromAmount)
                          ).toLocaleString()
                        : fromAmount}
                    </p>
                    <img className="w-6 h-6 mr-2" src="/sol.png" />
                  </div>

                  <div className="flex flex-col space-y-2">
                    {organization.allowsAnon && (
                      <div className="flex items-center gap-x-3">
                        <div
                          className={`p-3 h-full cursor-pointer flex-shrink-0 rounded-xl text-bonk-orange duration-300 transition-all ${
                            isAnonymous
                              ? "bg-bonk-orange text-bonk-white"
                              : "bg-bonk-orange/10"
                          }`}
                          onClick={() => setIsAnonymous(!isAnonymous)}
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
                            <rect
                              width="18"
                              height="18"
                              x="3"
                              y="3"
                              rx="2"
                            ></rect>
                            <circle cx="12" cy="10" r="3"></circle>
                            <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </div>
                        Give anonymously
                      </div>
                    )}

                    {organization.isReceiptEnabled && (
                      <div className="flex items-center gap-x-3">
                        <div
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
                        I want to receive a receipt
                      </div>
                    )}
                  </div>

                  {!isAnonymous ? (
                    <form className="space-y-4">
                      <p className="text-bonk-orange text-sm mb-1 mt-4 text-left">
                        Personal Information
                      </p>
                      <div className="flex gap-4">
                        <input
                          className="w-full text-bonk-orange placeholder:text-bonk-orange px-3 flex focus:outline-none border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl mb-4"
                          type="text"
                          placeholder="First name *"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                        <input
                          className="w-full text-bonk-orange placeholder:text-bonk-orange px-3 flex focus:outline-none border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl mb-4"
                          type="text"
                          placeholder="Last name *"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>

                      <input
                        className="w-full text-bonk-orange placeholder:text-bonk-orange px-3 flex focus:outline-none border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl mb-4"
                        type="text"
                        placeholder="Address 1 *"
                        value={addressLine1}
                        onChange={(e) => setaddressLine1(e.target.value)}
                        required
                      />
                      <input
                        className="w-full text-bonk-orange placeholder:text-bonk-orange px-3 flex focus:outline-none border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl mb-4"
                        type="text"
                        placeholder="Address 2"
                        value={addressLine2}
                        onChange={(e) => setaddressLine2(e.target.value)}
                      />
                      <div className="flex gap-4">
                        <input
                          className="w-full text-bonk-orange placeholder:text-bonk-orange px-3 flex focus:outline-none border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl mb-4"
                          type="text"
                          placeholder="Country *"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                        />
                        <input
                          className="w-full text-bonk-orange placeholder:text-bonk-orange px-3 flex focus:outline-none border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl mb-4"
                          type="text"
                          placeholder="State/Province"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-4">
                        <input
                          className="w-full text-bonk-orange placeholder:text-bonk-orange px-3 flex focus:outline-none border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl mb-4"
                          type="text"
                          placeholder="City *"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                        <input
                          className="w-full text-bonk-orange placeholder:text-bonk-orange px-3 flex focus:outline-none border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl mb-4"
                          type="text"
                          placeholder="ZIP/Postal Code *"
                          value={zipcode}
                          onChange={(e) => setZipcode(e.target.value)}
                          required
                        />
                      </div>
                    </form>
                  ) : null}

                  {wantReceipt ? (
                    <>
                      <p className="text-bonk-orange text-sm mb-1 mt-5">
                        Email
                      </p>
                      <input
                        className="w-full text-bonk-orange placeholder:text-bonk-orange px-3 flex focus:outline-none border items-center border-bonk-orange bg-bonk-orange/10 bg-opacity-5  border-opacity-40 focus:border-opacity-500 py-2 rounded-xl mb-4"
                        type="email"
                        placeholder="example@example.com"
                        value={receiptEmail}
                        onChange={(e) => setReceiptEmail(e.target.value)}
                        required
                      />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="mt-auto w-full pt-4">
              {signature ? (
                <button
                  className={`w-full flex justify-center text-center cursor-pointer bg-green-500 hover:bg-green-400 text-white font-semibold py-3 rounded-lg focus:outline-none focus:shadow-outline`}
                  type="button"
                  onClick={viewTx}
                >
                  Success! View on explorer
                </button>
              ) : (
                <button
                  className={`w-full flex justify-center text-center cursor-pointer bg-bonk-orange duration-300 transition-all text-white font-semibold py-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    quoteLoading || fromAmount === 0
                      ? "opacity-20"
                      : "hover:opacity-75"
                  }`}
                  type="button"
                  disabled={fromAmount === 0 || quoteLoading}
                  onClick={donate}
                >
                  {isLoading ? (
                    <span className="flex py-1 text-white">
                      <Loader />
                    </span>
                  ) : (
                    "Donate"
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default DonationWidget;
