// api/list.js
import { NextApiRequest, NextApiResponse } from "next";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { PROGRAM_ID_PUBKEY } from "../src/constants";
import { BonkPaws, IDL } from "../src/idl";
import { Connection, Keypair } from "@solana/web3.js";

if (!process.env.SIGNING_KEY) {
  throw new Error("Signing key missing")
}
if (!process.env.NEXT_PUBLIC_RPC_URL) {
  throw new Error("RPC missing")
}
const signer = Keypair.fromSecretKey(new Uint8Array(process.env.SIGNING_KEY.split(",").map(n => parseInt(n))));
const rpc: string = process.env.NEXT_PUBLIC_RPC_URL;
const connection = new Connection(rpc)
const preflightCommitment = "processed";
const commitment = "processed";

const provider = new AnchorProvider(connection, new Wallet(signer), {
  preflightCommitment,
  commitment,
});

const program = new Program<BonkPaws>(IDL, PROGRAM_ID_PUBKEY, provider);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const state = await program.account.matchDonationState.all();
    if (!state.length) {
      throw new Error("No open match states found")
    }
    res.json(state);
  } catch(e) {
    res.status(400).json({ 
      success: false, 
      error: e 
    })
  }
};