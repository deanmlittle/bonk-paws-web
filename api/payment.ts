// api/payment.js
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { CreateEd25519InstructionWithPrivateKeyParams, Ed25519Program, PublicKey } from "@solana/web3.js";

const [login, password, baseURL] = [
  process.env.TGB_API_LOGIN, 
  process.env.TGB_API_PASSWORD, 
  process.env.TGB_API_URL
];

const signingKey: Array<number> = JSON.parse(process.env.SIGNING_KEY!);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { searchParams } = new URL(req.url!, "http://localhost:3000");
  const organizationId = parseInt(searchParams.get('id')!);

  const thegivingblock = axios.create({
    baseURL,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
  try {
    const { data: loginData } = await thegivingblock.post("login", { login, password });
    const { data: donation } = await thegivingblock.post("deposit-address", {
      organizationId,
      isAnonymous: false,
      pledgeCurrency: 'SOL',
      pledgeAmount: '0.1',
      receiptEmail: 'test-email-address@thegivingblock.com',
      firstName: 'Test',
      lastName: 'User',
      addressLine1: 'Street 4321',
      addressLine2: 'Apt 55',
      country: 'US',
      state: 'NY',
      city: 'New York',
      zipcode: '442452'
    }, { 
      headers: { 
        "Authorization": "Bearer " + loginData.data.accessToken 
      }
    }
    );

    const { data: match } = await thegivingblock.post("deposit-address", 
    {
      organizationId,
      isAnonymous: false,
      pledgeCurrency: 'SOL',
      pledgeAmount: '0.1',
      receiptEmail: 'test-email-address@thegivingblock.com',
      firstName: 'Test',
      lastName: 'User',
      addressLine1: 'Street 4321',
      addressLine2: 'Apt 55',
      country: 'US',
      state: 'NY',
      city: 'New York',
      zipcode: '442452'
    },
    { 
      headers: { 
        "Authorization": "Bearer " + loginData.data.accessToken 
      }
    })

    let donationAddress = new PublicKey(donation.data.depositAddress);
    let matchAddress = new PublicKey(match.data.depositAddress);
    let b = Buffer.allocUnsafe(8);
    b.writeBigUInt64LE(BigInt(organizationId));
    b = Buffer.concat([b, Buffer.from(donationAddress.toBytes()), Buffer.from(matchAddress.toBytes())]);

    let ixOpts: CreateEd25519InstructionWithPrivateKeyParams = {
      privateKey: Uint8Array.from(signingKey),
      message: b
    };
    let ix = Ed25519Program.createInstructionWithPrivateKey(ixOpts)
    res.status(200).json({ success: true, message: { donationAddress, matchAddress, ix: ix.data.toString("hex") }});
  } catch(e) {
    res.status(400).json({ success: false, message: e });
  }
};