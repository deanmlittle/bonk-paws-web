// api/organization.ts
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
const [login, password, baseURL, siteUrl] = [
  process.env.TGB_API_LOGIN, 
  process.env.TGB_API_PASSWORD, 
  process.env.TGB_API_URL,
  process.env.VERCEL_URL || "http://localhost:3000/",
];


export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(login, password, baseURL)
  console.log(req.url);
  const { searchParams } = new URL(req.url!, siteUrl);
  const organizationId = searchParams.get('id');

  const thegivingblock = axios.create({
    baseURL,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
  try {
    const { data: loginData } = await thegivingblock.post("login", { login, password });
    const { data } = await thegivingblock.get<{ data: any}>("organization/" + organizationId, { 
      headers: { 
        "Authorization": "Bearer " + loginData.data.accessToken 
      }
    }
    );
    
    return res.status(200).send({ success: true, data });
  } catch(e) {
    return res.status(400).send({ success: false, error: e });
  }
};