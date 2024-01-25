import { Address, AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { AddressLookupTableAccount, Connection, Ed25519Program, Keypair, LAMPORTS_PER_SOL, PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, SystemProgram, TransactionInstruction, TransactionMessage,  VersionedTransaction} from "@solana/web3.js";
import { NextResponse } from "next/server";
import { BonkForPaws, IDL } from "../../../../api/program";

const PROGRAM_ID = "4p78LV6o9gdZ6YJ3yABSbp3mVq9xXa4NqheXTB1fa4LJ"
const auth_keypair = JSON.parse(process.env.KEYPAIR!);
const AUTH_WALLET = Keypair.fromSecretKey(new Uint8Array(auth_keypair));
const connection = new Connection("https://multi-compatible-dream.solana-mainnet.quiknode.pro/ab10715a148f3ffb855f7e7665821f318f1c2cb8/");
const donor = new Wallet(AUTH_WALLET);


const provider = new AnchorProvider(connection, donor, { commitment: "confirmed"});
const program = new Program<BonkForPaws>(IDL, PROGRAM_ID as Address, provider);

export const deserializeInstruction = (instruction: any) => {
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

export const getAddressLookupTableAccounts = async (
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

const addressLookupTableAccounts: AddressLookupTableAccount[] = [];

export const getMatchAndFinalize = async (
  amountDonated: number,
  charity: PublicKey,
  matchDonationState: PublicKey,
) => {

  const authority = new PublicKey("BDEECMrE5dv4cc5na6Fi8sNkfzYxckd6ZjsuEzp7hXnJ");
  const bonk = new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263")
  const authorityBonk = getAssociatedTokenAddressSync(bonk, authority,);
  const wsol = new PublicKey("So11111111111111111111111111111111111111112")
  const authorityWsol = getAssociatedTokenAddressSync(wsol, authority,);

  const donationState = PublicKey.findProgramAddressSync([Buffer.from('donation_state')], program.programId)[0];
  amountDonated=amountDonated*10_000;

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
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
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
      tokenLedgerInstruction,
      computeBudgetInstructions,
      setupInstructions,
      swapInstruction: swapInstructionPayload,
      cleanupInstruction,
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


  const matchAndFinalize = async (amountDonated: number, charityWallet2_str: string, matchDonationState_str: string) => {
    const charityWallet2 = new PublicKey(charityWallet2_str);
    const matchDonationState = new PublicKey(matchDonationState_str);
    const {matchIx, swapIx, finalizeIx, addressLookupTableAccounts} = await getMatchAndFinalize(amountDonated, charityWallet2, matchDonationState);
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: AUTH_WALLET.publicKey,
        recentBlockhash: blockhash,
        instructions: [
          matchIx,
          swapIx,
          finalizeIx,
        ],
    }).compileToV0Message(addressLookupTableAccounts);

    const transaction = new VersionedTransaction(messageV0);
    console.log(transaction);
    transaction.sign([AUTH_WALLET]);

    const txid = await connection.sendTransaction(transaction, {skipPreflight:true});
     
    return txid;

}

export async function POST(request:any){
  const {
    fromAmount,
    charityWallet2,
    matchDonationState,
  } = await request.json();
  const signature = await matchAndFinalize(fromAmount, charityWallet2, matchDonationState);
  return NextResponse.json({matchAndFinalize:signature})
}
