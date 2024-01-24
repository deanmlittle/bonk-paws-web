import { Ed25519Program, Keypair } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

const auth_keypair = JSON.parse(process.env.KEYPAIR!);
const AUTH_WALLET = Keypair.fromSecretKey(new Uint8Array(auth_keypair))

export async function POST(request:any){
    const {
        charityWallet1,
        charityWallet2,
        id
    } = request.json();
    const bufid = new BN(id);

    const signatureIx = Ed25519Program.createInstructionWithPrivateKey({
        // ADD THE PRIVATE KEY SIGNER HERE
        privateKey: AUTH_WALLET.secretKey,
        message: Buffer.concat([Buffer.from(bufid.toString()), charityWallet1.toBuffer(), charityWallet2.toBuffer()]),
    });
    const signatureIx_json = JSON.stringify(signatureIx);


    return Response.json(signatureIx_json, {status:201})
}