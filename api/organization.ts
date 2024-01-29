// api/organization.ts
import axios from "axios";

const [login, password, baseURL] = [
  process.env.TGB_API_LOGIN, 
  process.env.TGB_API_PASSWORD, 
  process.env.TGB_API_URL
];


export default async (req: Request, res: any) => {
  console.log(login, password, baseURL)
  console.log(req.url);
  const { searchParams } = new URL(req.url, "http://localhost:3000");
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
    console.log(loginData);
    const { data } = await thegivingblock.get<{ data: any}>("organization/" + organizationId, { 
      headers: { 
        "Authorization": "Bearer " + loginData.data.accessToken 
      }
    }
    );

    console.log(data);
    
    res.status(200).json({ success: true, data });
  } catch(e) {
    // console.log(e)
    res.status(400).json({ success: false, message: e });
  }
};