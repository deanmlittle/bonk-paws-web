import { Ed25519Program, Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

const auth_keypair = JSON.parse(process.env.KEYPAIR!);
const AUTH_WALLET = Keypair.fromSecretKey(new Uint8Array(auth_keypair))

export async function POST(request:any){
    const {
        charityWallet1,
        charityWallet2,
        id
    } = await request.json();
    console.log(charityWallet1);
    const charityWallet1pub = new PublicKey(charityWallet1);
    const charityWallet2pub = new PublicKey(charityWallet2);

    const bufid = new BN(id);

    const signatureIx = Ed25519Program.createInstructionWithPrivateKey({
        // ADD THE PRIVATE KEY SIGNER HERE
        privateKey: AUTH_WALLET.secretKey,
        message: Buffer.concat([bufid.toArrayLike(Buffer, 'le', 8), charityWallet1pub.toBuffer(), charityWallet2pub.toBuffer()]),
    });
    const signatureIx_json = JSON.stringify(signatureIx);
    console.log(signatureIx_json);


    return Response.json(signatureIx,{status:201})
}