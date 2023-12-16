// api/organizations.js
import axios from "axios";

const [login, password, baseURL] = [
  process.env.TGB_API_LOGIN, 
  process.env.TGB_API_PASSWORD, 
  process.env.TGB_API_URL
];

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const thegivingblock = axios.create({
    origin: false,
    baseURL,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
  try {
    const { data: loginData } = await thegivingblock.post("login", { login, password });
    const { data } = await thegivingblock.get("organizations/list", { headers: { "Authorization": "Bearer " + loginData.data.accessToken }});
    res.status(200).json({ success: true, message: data });
  } catch(e) {
    // console.log(e)
    res.status(400).json({ success: false, message: e });
  }
};