// api/match.js
import { NextApiRequest, NextApiResponse } from "next";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { PROGRAM_ID_PUBKEY } from "../src/constants";
import { BonkPaws, IDL } from "../src/idl";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { AddressLookupTableAccount, ComputeBudgetProgram, Connection, Keypair, PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, SystemProgram, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

type SwapQuote = {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: null | any; // Use 'any' for unknown structure
  priceImpactPct: string;
  routePlan: SwapPlan;
  contextSlot: number;
  timeTaken: number;
};

type SwapInfo = {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
};

type SwapPlan = {
  swapInfo: SwapInfo;
  percent: number;
};  

type SwapInstruction = {
  tokenLedgerInstruction: null | any; // Use 'any' for unknown structure
  computeBudgetInstructions: {
    programId: string;
    accounts: any[]; // Use 'any' for unknown structure
    data: string;
  }[];
  setupInstructions: {
    programId: string;
    accounts: any[]; // Use 'any' for unknown structure
    data: string;
  }[];
  swapInstruction: {
    programId: string;
    accounts: any[][]; // Use 'any' for unknown structure
    data: string;
  };
  cleanupInstruction: {
    programId: string;
    accounts: any[]; // Use 'any' for unknown structure
    data: string;
  };
  addressLookupTableAddresses: string[];
};


if (!process.env.SIGNING_KEY) {
  throw new Error("Signing key missing")
}
if (!process.env.NEXT_PUBLIC_RPC_URL) {
  throw new Error("RPC missing")
}
const API_ENDPOINT = "https://quote-api.jup.ag/v6";
const signer = Keypair.fromSecretKey(new Uint8Array(process.env.SIGNING_KEY.split(",").map(n => parseInt(n))));
const rpc: string = process.env.NEXT_PUBLIC_RPC_URL;
const connection = new Connection(rpc)
const preflightCommitment = "processed";
const commitment = "processed";

const provider = new AnchorProvider(connection, new Wallet(signer), {
  preflightCommitment,
  commitment,
});

const wallet = provider.wallet;

const program = new Program<BonkPaws>(IDL, PROGRAM_ID_PUBKEY, provider);

const bonk = new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263")
const signerBonk = getAssociatedTokenAddressSync(bonk, signer.publicKey);
const wsol = new PublicKey("So11111111111111111111111111111111111111112")
const signerWsol = getAssociatedTokenAddressSync(wsol, signer.publicKey);
const donationState = PublicKey.findProgramAddressSync([Buffer.from("donation_state")], program.programId)[0];

const getQuote = async (
  fromMint: PublicKey,
  toMint: PublicKey,
  amount: number
): Promise<SwapQuote> => {
  return fetch(
    `${API_ENDPOINT}/quote?outputMint=${toMint.toBase58()}&inputMint=${fromMint.toBase58()}&amount=${amount}&swapMode=ExactOut&slippage=0.5`
  ).then(async (response) => await response.json() as SwapQuote );
};

const getSwapIx = async (user: PublicKey, quote: any) => {
  const data = {
    quoteResponse: quote,
    userPublicKey: user.toBase58(),
  };

  return fetch(`${API_ENDPOINT}/swap-instructions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => await response.json() as SwapInstruction);
}

const deserializeInstruction = (instruction: any) => {
  return new TransactionInstruction({
    programId: new PublicKey(instruction.programId),
    keys: instruction.accounts.map((key: any) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    })),
    data: Buffer.from(instruction.data, "base64"),
  });
};

const getAddressLookupTableAccounts = async (
  keys: string[]
): Promise<AddressLookupTableAccount[]> => {
  const addressLookupTableAccountInfos =
    await connection.getMultipleAccountsInfo(
      keys.map((key) => new PublicKey(key))
    );

  return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
    const addressLookupTableAddress = keys[index];
    if (accountInfo) {
      const addressLookupTableAccount = new AddressLookupTableAccount({
        key: new PublicKey(addressLookupTableAddress),
        state: AddressLookupTableAccount.deserialize(accountInfo.data),
      });
      acc.push(addressLookupTableAccount);
    }

    return acc;
  }, new Array<AddressLookupTableAccount>());
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const state = await program.account.matchDonationState.all();
    if (!state.length) {
      throw new Error("No open match states found")
    }
    const matchDonationState = state[0];
    const matchIx = await program.methods
    .matchDonation()
    .accounts({
      signer: signer.publicKey,
      bonk,
      signerBonk,
      wsol,
      signerWsol,
      donationState, 
      matchDonationState: matchDonationState.publicKey,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,  
    })
    .instruction();

    const finalizeIx = await program.methods
    .finalizeDonation()
    .accounts({
      donor: signer.publicKey,
      charity: matchDonationState.account.matchKey,
      wsol,
      donorWsol: signerWsol,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,  
    })
    .instruction();

    const quote = await getQuote(
      bonk,
      wsol,
      matchDonationState.account.donationAmount.toNumber()
    );

    const {
      swapInstruction: swapInstructionPayload, // The actual swap instruction.
      addressLookupTableAddresses, // The lookup table addresses that you can use if you are using versioned transaction.
    } = await getSwapIx(
        wallet.publicKey,
        quote
    )

    const addressLookupTableAccounts: AddressLookupTableAccount[] = [];

    addressLookupTableAccounts.push(
      ...(await getAddressLookupTableAccounts(addressLookupTableAddresses))
    );

    const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const messageV0 = new TransactionMessage({
      payerKey: signer.publicKey,
      recentBlockhash,
      instructions: [
        ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }),
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1458 }),
        matchIx,
        deserializeInstruction(swapInstructionPayload),
        finalizeIx
      ],
    }).compileToV0Message(addressLookupTableAccounts);
    let transaction = new VersionedTransaction(messageV0);
    transaction.sign([signer]);
    await provider.sendAndConfirm(transaction, [signer])
  } catch(e) {
    res.status(400).json({ 
      success: false, 
      error: e 
    })
  }
};