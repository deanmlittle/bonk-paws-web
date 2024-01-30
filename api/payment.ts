// api/payment.js
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { CreateEd25519InstructionWithPrivateKeyParams, Ed25519Program, Keypair, PublicKey } from "@solana/web3.js";
import { APP_URL, bonkFoundationDefaultDetails } from "../src/constants";
import { DepositDetails } from "@/types";

const [login, password, baseURL] = [
  process.env.TGB_API_LOGIN, 
  process.env.TGB_API_PASSWORD, 
  process.env.TGB_API_URL
];

const signingKey: Array<number> = JSON.parse(process.env.SIGNING_KEY!);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!login) throw ("TGB Login not set");
    if (!password) throw ("TGB Password not set");
    if (!baseURL) throw ("TGB API URL not set");

    const { searchParams } = new URL(req.url!, APP_URL);
    const organizationId = parseInt(searchParams.get('id')!);

    const depositDetails: DepositDetails = req.body();
  
    const thegivingblock = axios.create({
      baseURL,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      }
    })
  
    const { data: loginData } = await thegivingblock.post("login", { login, password });
    const { data: donation } = await thegivingblock.post("deposit-address", depositDetails, { 
        headers: { 
          "Authorization": "Bearer " + loginData.data.accessToken 
        }
      }
    );

    let bonkDepositDetails: DepositDetails = {
      ...bonkFoundationDefaultDetails,
      pledgeAmount: depositDetails.pledgeAmount,
      organizationId: depositDetails.organizationId
    }

    const { data: match } = await thegivingblock.post(
      "deposit-address", 
      // Use Bonk Foundation's details
      bonkDepositDetails,
      { 
        headers: { 
          "Authorization": "Bearer " + loginData.data.accessToken 
        }
      }
    )

    // Get two charity donation keys and signer
    let donationAddress = new PublicKey(donation.data.depositAddress);
    let matchAddress = new PublicKey(match.data.depositAddress);
    let signer = Keypair.fromSecretKey(new Uint8Array(signingKey)).publicKey.toBase58();
    
    // Organization name as u64LE
    let b = Buffer.allocUnsafe(8);
    b.writeBigUInt64LE(BigInt(organizationId));

    // Concatenate ID and two donation keys for signing
    b = Buffer.concat([b, Buffer.from(donationAddress.toBytes()), Buffer.from(matchAddress.toBytes())]);

    // Create Ed25519 instruction
    let ixOpts: CreateEd25519InstructionWithPrivateKeyParams = {
      privateKey: Uint8Array.from(signingKey),
      message: b
    };
    let ix = Ed25519Program.createInstructionWithPrivateKey(ixOpts)

    // Return keys and serialized IX
    res.status(200).json({ 
      success: true, 
      data: { 
        donationAddress, 
        matchAddress, 
        signer, 
        signatureIx: ix.data.toString("hex")
      }
    })
  } catch(e) {
    res.status(400).json({ 
      success: false, 
      error: e 
    })
  }
};