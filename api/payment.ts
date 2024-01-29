// api/organizations.js
import axios from "axios";

const [login, password, baseURL] = [
  process.env.TGB_API_LOGIN, 
  process.env.TGB_API_PASSWORD, 
  process.env.TGB_API_URL
];

export default async (req: Request, res: any) => {
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
    const { data: address1 } = await thegivingblock.post("deposit-address", { 
      headers: { 
        "Authorization": "Bearer " + loginData.data.accessToken 
      },
      data: {
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
      }
    }
    );

    // const { data: address2 } = await thegivingblock.post("deposit-address", { 
    //   headers: { 
    //     "Authorization": "Bearer " + loginData.data.accessToken 
    //   },
    //   data: {
    //     organizationId,
    //     isAnonymous: true,
    //     pledgeCurrency: 'SOL',
    //     pledgeAmount: '0.1'
    //   }
    // }) 
    res.status(200).json({ success: true, message: { address1 }});
  } catch(e) {
    // console.log(e)
    res.status(400).json({ success: false, message: e });
  }
};