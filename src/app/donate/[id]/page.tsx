"use client";
import DonationWidget from "@/app/components/DonationWidget";
import { APP_URL } from "@/constants";
import { Organization } from "@/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { organizations } from "@/animal-charities";
import OrganizationDonationHistory from "@/app/components/OrganizationDonationHistory";

type DonateProps = {
  params: {
    id: string;
  };
};

export default function Donate({ params }: DonateProps) {
  const [currentOrg, setCurrentOrg] = useState<any>(null);
  const id =
    organizations
      .find((o) => {
        return o.slug === params.id;
      })
      ?.id.toString() || params.id;

  // const currentOrg = {
  //   id: 1189132642,
  //   name: "Operation Kindness",
  //   logo: "https://static.tgbwidget.com/organization_logo%2F6fd1dde8-bc64-496b-b3dd-f3f53e8959da.jpg",
  //   country: "USA",
  //   allowsAnon: true,
  //   nonprofitTaxID: "75-1553350",
  //   areNotesEnabled: false,
  //   isReceiptEnabled: true,
  //   createdAt: "2022-07-12T15:26:23.993Z",
  //   state: "TX",
  //   city: "Carrollton",
  //   postcode: "75006",
  //   nonprofitAddress1: "3201 Earhart Drive",
  //   nonprofitAddress2: "",
  //   uuid: "d7c2100e-1166-4eea-b46e-0d6788468a33",
  //   areFiatDonationsEnabled: true,
  //   areCryptoDonationsEnabled: true,
  //   areStockDonationsEnabled: true,
  //   areDafDonationsEnabled: true,
  //   areTributesEnabled: null,
  //   organizationType: "organization",
  //   categories: [
  //     {
  //       id: 2,
  //       name: "Animals",
  //     },
  //   ],
  //   widgetCode: {
  //     iframe:
  //       '<iframe frameborder="0" width="430" height="820" scrolling="no" src="https://widget.thegivingblock.com?charityID=1189132642&display=embedded&version=2&apiUserUuid=fb787c52-8db3-4de0-8833-599a2567f987"></iframe>',
  //     script:
  //       '<script id="tgb-widget-script">  !function t(e,i,n,g,x,r,s,d,a,y,w,q,c,o){var p="tgbWidgetOptions";e[p]?(e[p]=e[p].length?e[p]:[e[p]],  e[p].push({id:r,apiUserUuid:x,domain:g,buttonId:d,scriptId:s,uiVersion:a,donationFlow:y,fundraiserId:w,campaignId:q}))  :e[p]={id:r,apiUserUuid:x,domain:g,buttonId:d,scriptId:s,uiVersion:a,donationFlow:y,fundraiserId:w,campaignId:q},  (c=i.createElement(n)).src=[g,"/widget/script.js"].join(""),c.async=1,  (o=i.getElementById(s)).parentNode.insertBefore(c,o)  }(window,document,"script","https://widget.thegivingblock.com","fb787c52-8db3-4de0-8833-599a2567f987",  "1189132642","tgb-widget-script","tgb-widget-button",  "2", "", "", "");</script>',
  //     popup:
  //       '<button id="tgb-widget-button" style="font-family: \'Noto Sans\', \'Roboto\',\'Helvetica\',\'Arial\',sans-serif;border-radius: 5px;background-color: #FCD42B;border: 1px solid #FCD42B;color: #291B4F;font-size: 16px;font-weight: 500;padding: 13px 30px 14px;">Donate Now</button><script id="tgb-widget-script">  !function t(e,i,n,g,x,r,s,d,a,y,w,q,c,o){var p="tgbWidgetOptions";e[p]?(e[p]=e[p].length?e[p]:[e[p]],  e[p].push({id:r,apiUserUuid:x,domain:g,buttonId:d,scriptId:s,uiVersion:a,donationFlow:y,fundraiserId:w,campaignId:q}))  :e[p]={id:r,apiUserUuid:x,domain:g,buttonId:d,scriptId:s,uiVersion:a,donationFlow:y,fundraiserId:w,campaignId:q},  (c=i.createElement(n)).src=[g,"/widget/script.js"].join(""),c.async=1,  (o=i.getElementById(s)).parentNode.insertBefore(c,o)  }(window,document,"script","https://widget.thegivingblock.com","fb787c52-8db3-4de0-8833-599a2567f987",  "1189132642","tgb-widget-script","tgb-widget-button",  "2", "", "", "");</script>',
  //   },
  //   websiteBlocks: {
  //     url: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value: "https://www.operationkindness.org/",
  //     },
  //     donationUrl: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value: "https://www.operationkindness.org/",
  //     },
  //     socialTitle: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value: "Donate Bitcoin to Operation Kindness | The Giving Block",
  //     },
  //     socialDescription: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value:
  //         "Donate Bitcoin to nonprofits like Operation Kindness who accept cryptocurrency, crypto donations are tax deductible.",
  //     },
  //     taxType: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value: null,
  //     },
  //     is501C3: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value: "true",
  //     },
  //     missionStatement: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value:
  //         "Operation Kindness, a 501(c)(3) non-profit animal welfare organization, operates a lifesaving animal shelter and programs to assist people and pets.",
  //     },
  //     whyDonate: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value:
  //         "Your donation of cryptocurrency will provide lifesaving medical care, food, shelter, and love to pets in need.",
  //     },
  //     youtubeUrl: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value: "https://youtu.be/2vnmkoFo80U",
  //     },
  //     twitterHandle: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value: "@OpKindness",
  //     },
  //     slug: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value: "operation-kindness",
  //     },
  //     tags: {
  //       value: null,
  //     },
  //     pageTitle: {
  //       settings: {
  //         isEnabled: true,
  //       },
  //       value: "Operation Kindness",
  //     },
  //     isLeaderboardEnabled: {
  //       value: null,
  //     },
  //   },
  //   fundsDesignations: null,
  //   shift4ApiVersion: 2,
  //   shift4PublicKey: "pk_live_b5isbPDLgQIh5EaVxDkqlI3C",
  // };

  useEffect(() => {
    const getCharityInfo = async () => {
      try {
        const res = await fetch(APP_URL + `/api/organization?id=${id}`);
        const json = await res.json();
        setCurrentOrg(json?.data?.data?.organization);
        return json;
      } catch (err) {
        console.log(err);
      }
    };
    getCharityInfo();
  }, []);

  return (
    <main className="flex min-h-screen flex-col mt-8">
      <div className="relative px-6 pt-0 lg:px-8 mt-16 h-full">
        {currentOrg ? (
          <div className="w-full h-full grid grid-cols-1 mx-auto lg:max-w-screen-xl lg:grid-cols-5 gap-y-10 lg:gap-16">
            <div className="col-span-3 flex flex-col">
              <h1 className="mt-5 font-bold tracking-tighter text-4xl py-4 text-bonk-orange font-herborn">
                {currentOrg.name}
              </h1>
              <p className="text-xl text-yellow-600 font-medium">
                {currentOrg.websiteBlocks?.missionStatement?.value}
              </p>
              <div className="flex gap-x-4 mt-10">
                {currentOrg.isReceiptEnabled && (
                  <div className="flex items-center gap-x-2">
                    <img src="/receipt.svg" alt="receipt" />
                    Receipt Available
                  </div>
                )}
                {currentOrg.allowsAnon && (
                  <div className="flex items-center gap-x-2">
                    <img src="/anonymous.svg" alt="receipt" />
                    Allows Anonymous Donations
                  </div>
                )}
              </div>
              <div className="mt-10 w-full h-[60vh] flex items-center justify-center relative rounded-xl overflow-hidden shadow-2xl shadow-bonk-orange/50 hover:scale-95 hover:rotate-1 duration-300 transition-all">
                <img
                  className="lg:w-1/3 mx-auto z-10 relative rounded-lg"
                  src={currentOrg.logo}
                  alt={currentOrg.name}
                />
                <img
                  className="absolute top-0 w-full mx-auto rounded-lg blur-[50px] brightness-100 scale-125"
                  src={currentOrg.logo}
                  alt={currentOrg.name}
                />
              </div>
              <h1 className="mt-10 font-bold tracking-tighter text-2xl text-bonk-orange font-herborn">
                Donation History
              </h1>
              <OrganizationDonationHistory id={currentOrg.id} />
            </div>
            <div className="col-span-2 w-full transition-all rounded-lg">
              <h1 className="mt-10 font-bold tracking-tighter text-2xl text-bonk-orange font-herborn">
                Make a Donation!
              </h1>
              <DonationWidget organization={currentOrg} />
            </div>
          </div>
        ) : (
          <>
            <div className="relative h-[70dvh] flex items-center justify-center animate-paws">
              <img
                src="/paw.png"
                alt="Paw"
                className="w-32 absolute transform translate-y-24 -translate-x-24 paw2"
              ></img>
              <img
                src="/paw.png"
                alt="Paw"
                className="w-32 absolute paw1"
              ></img>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
