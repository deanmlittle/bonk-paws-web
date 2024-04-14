// api/match.js
import { NextApiRequest, NextApiResponse } from "next";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import { PROGRAM_ID_PUBKEY } from "../src/constants";
import { BonkPaws, IDL } from "../src/idl";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, SystemProgram } from "@solana/web3.js";
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
if (!process.env.SIGNING_KEY) {
  throw new Error("Signing key missing")
}
if (!process.env.NEXT_PUBLIC_RPC_URL) {
  throw new Error("RPC missing")
}
const signer: number[] = process.env.SIGNING_KEY.split(",").map(n => parseInt(n));
const rpc: string = process.env.NEXT_PUBLIC_RPC_URL;
const connection = new Connection(rpc)
const preflightCommitment = "processed";
const commitment = "processed";

const provider = new AnchorProvider(connection, new Wallet(Keypair.fromSecretKey(new Uint8Array(signer))), {
  preflightCommitment,
  commitment,
});

const program = new Program<BonkPaws>(IDL, PROGRAM_ID_PUBKEY, provider);

const signingKey: Array<number> = JSON.parse(process.env.SIGNING_KEY!);
const authority = new PublicKey("bfp1sHRTCvq7geo1hkBuaYbiFdEhsfeoidqimJDuSEy");
const bonk = new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263")
const authorityBonk = getAssociatedTokenAddressSync(bonk, authority);
const wsol = new PublicKey("So11111111111111111111111111111111111111112")
const authorityWsol = getAssociatedTokenAddressSync(wsol, authority);

/*
export const getMatchAndFinalize = async (
  matchDonationState: PublicKey,
  program:Program<BonkPaws>
) => {
  const amountResponse = await (
    
      await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263&outputMint=So11111111111111111111111111111111111111112&amount=${amountDonated}&swapMode=ExactOut&slippageBps=50`)
  ).json() as { inAmount: string };
  const quoteResponse = await (
      await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263\&outputMint=So11111111111111111111111111111111111111112\&amount=${amountResponse.inAmount}\&slippageBps=50`)
  ).json() as { outAmount: string };

  const instructions = await (
      await fetch('https://quote-api.jup.ag/v6/swap-instructions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              quoteResponse,
              userPublicKey: authority.toBase58(),
          })
      })
  ).json();
  

  const matchIx = await program.methods
  .matchDonation(new BN(amountResponse.inAmount))
  .accounts({
    authority,
    charity,
    bonk,
    authorityBonk,
    wsol,
    authorityWsol,
    donationState, 
    matchDonationState,
    instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,  
  })
  .instruction()
    
  const typedInstructions = instructions as {
      tokenLedgerInstruction?: any,
      computeBudgetInstructions?: any,
      setupInstructions?: any,
      swapInstruction?: any,
      cleanupInstruction?: any,
      addressLookupTableAddresses?: any,
      error?: string
  };

  if (typedInstructions.error) {
      throw new Error("Failed to get swap instructions: " + typedInstructions.error);
  }

  const {
      swapInstruction: swapInstructionPayload,
      addressLookupTableAddresses,
  } = typedInstructions;

  addressLookupTableAccounts.push(
      ...(await getAddressLookupTableAccounts(addressLookupTableAddresses))
  );

  const finalizeIx = await program.methods
  .finalizeDonation()
  .accounts({
      donor: authority,
      charity,
      wsol,
      donorWsol: authorityWsol,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
  })
  .instruction()

  const swapIx = deserializeInstruction(swapInstructionPayload);

  return {
      matchIx,
      swapIx,
      finalizeIx,
      addressLookupTableAccounts,
  };
};
*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const state = await program.account.matchDonationState.all();
    res.json(state);
    // const matchIx = await program.methods.finalizeDonation(seed, amount)
    //   .accounts({
    //     donor: publicKey,
    //     charity,
    //     donationState,
    //     matchDonationState,
    //     donationHistory,
    //     instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
    //     systemProgram: SystemProgram.programId
    //   }).instruction();
  } catch(e) {
    res.status(400).json({ 
      success: false, 
      error: e 
    })
  }
};