import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID!;
export const PROGRAM_ID_PUBKEY = new PublicKey(PROGRAM_ID!);
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;