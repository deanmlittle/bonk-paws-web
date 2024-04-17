// api/organization.ts
import { APP_URL } from "../src/constants";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
const [login, password, baseURL] = [
  process.env.TGB_API_LOGIN, 
  process.env.TGB_API_PASSWORD, 
  process.env.TGB_API_URL,
];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!login) throw ("TGB Login not set");
    if (!password) throw ("TGB Password not set");
    if (!baseURL) throw ("TGB API URL not set");

    const { searchParams } = new URL(req.url!, APP_URL);
    const organizationId = searchParams.get('id');

    const thegivingblock = axios.create({
      baseURL,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      }
    })

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