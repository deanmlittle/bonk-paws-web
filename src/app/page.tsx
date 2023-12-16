'use client';

import Modal from '@/app/components/Modal';
import OrganizationCard from '@/app/components/OrganizationCard';
import { Organization } from '@/types';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import React, { useState } from 'react';
import WalletButton from './components/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const [modalOrganization, setModalOrganization] = React.useState<Organization | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(true);
  const { publicKey, connected } = useWallet();
  const { setVisible: setModalVisible } = useWalletModal()
  const openWalletModal = () => {
    setModalVisible(true)
  }
  const donated = 4303201250;
  const organizations: Organization[] = [
    {
      "id": 127733,
      "logo": "https://static.tgbwidget.com/organization_logo%2Fe6ddf427-f982-4076-96bf-c0d32fd3c874.jpeg",
      "name": "Dogs for Better Lives"
    },
    {
      "id": 127877,
      "logo": "https://static.tgbwidget.com/organization_logo%2Fab74194c-26fc-41ca-a49a-2510f61e6eaa.jpg",
      "name": "Guide Dogs for the Blind"
    },
    {
      "id": 127887,
      "logo": "https://static.tgbwidget.com/organization_logo%2Fff2be8e6-eaf4-4026-9d2a-6833a5f5f9bc.jpg",
      "name": "Life Saver Dogs"
    },
    {
      "id": 128860,
      "logo": "https://static.tgbwidget.com/organization_logo/4ebf256d-9476-4a24-9cc9-32ad56bb8807.jpg",
      "name": "Operation Delta Dog"
    },
    {
      "id": 129703,
      "logo": "https://static.tgbwidget.com/organization_logo/c4b87168-2245-44a9-9310-3badf6349e9a.jpg",
      "name": "Royal Guide Dogs Australia"
    },
    {
      "id": 132647,
      "logo": "https://static.tgbwidget.com/organization_logo/98b96ba4-6193-4c6d-80a5-cedd5912c4f2.jpg",
      "name": "Seeing Eye Dogs Australia"
    },
    {
      "id": 133396,
      "logo": "https://static.tgbwidget.com/organization_logo/f34a87a9-736e-4a5a-aba3-9e0eb97a984c.jpeg",
      "name": "Edinburgh Dog and Cat Home"
    },
    {
      "id": 133777,
      "logo": "https://static.tgbwidget.com/MuttvilleSenior.jpg",
      "name": "Muttville Senior Dog Rescue"
    },
    {
      "id": 133921,
      "logo": "https://static.tgbwidget.com/organization_logo%2F05936f18-3557-4fb0-9e55-487c47444466.jpg",
      "name": "Semper K9 Assistance Dogs"
    },
    {
      "id": 134108,
      "logo": "https://static.tgbwidget.com/organization_logo%2F153ad16d-414d-4058-8339-fe4d4299c379.jpeg",
      "name": "Southeastern Guide Dogs, Inc."
    },
    {
      "id": 127621,
      "logo": "https://static.tgbwidget.com/ForgottenAnimals.jpg",
      "name": "Forgotten Animals"
    },
    {
      "id": 127691,
      "logo": "https://static.tgbwidget.com/organization_logo%2F39e4df7a-8661-495c-8a07-8feaebac55c0.jpg",
      "name": "Fund for Wild Nature"
    },
    {
      "id": 127725,
      "logo": "https://static.tgbwidget.com/organization_logo%2F5631253d-953f-4bcc-a105-c63f1eb860d4.jpg",
      "name": "PAWS"
    },
    {
      "id": 127749,
      "logo": "https://static.tgbwidget.com/organization_logo%2F19b4c12e-cf21-4dab-9b06-d84d54449803.jpg",
      "name": "Berkeley-East Bay Humane Society"
    },
    {
      "id": 127793,
      "logo": "https://static.tgbwidget.com/organization_logo%2F8e1f50fa-9166-400e-94db-d98ee90e39c6.jpeg",
      "name": "San Diego Humane Society"
    },
    {
      "id": 127979,
      "logo": "https://static.tgbwidget.com/organization_logo%2F3d3cbe44-13ef-491e-9612-7f3876333605.jpg",
      "name": "K9s For Warriors"
    }
  ];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Modal organization={modalOrganization}  isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="relative items-center text-center isolate px-6 pt-0 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-0 lg:py-20">
          <div className="mx-auto ">
            <div className="shiba-1 mx-auto w-40 max-w-40">
              <img className="shiba-1-head" src="shiba-1-head.png" />
              <img src="shiba-1-body.png" />
            </div>
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 mt-10 text-sm leading-6 text-slate-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                BONK for Paws is matching all BONK donations to animal-related causes 100% <a href="#statistics" className="font-semibold text-red-500"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&darr;</span></a>
              </div>
            </div>
            <h1 id="top" className="text-4xl font-bold tracking-tighter text-yellow-950 sm:text-6xl mt-10">Lend a helping paw!</h1>
            <p className="my-6 text-lg leading-8 text-gray-600">
              We&apos;re partnering with <a href="https://thegivingblock.com" className="text-bold text-red-500" target="_blank">The Giving Block</a> to match BONK donations to dog-related charities <span className="text-bold text-red-500">100%</span>. We&apos;re also burning <span className="text-bold text-red-500">1%</span> of your donation amount from our treasury, making your generous donations go even further!</p>
            { publicKey ? <a className="bg-red-500 hover:bg-red-400 text-white font-semibold py-3 px-5 border border-red-600 hover:border-red-600 rounded-lg" href="#charities">Get started!</a>
: <WalletButton onClick={openWalletModal} /> }
          </div>
        </div>
      </div>
      <div id="charities" className="flex flex-wrap justify-center grid grid-cols-1 mt-20 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-20">
        {
          organizations.map((organization) => (
            <OrganizationCard 
              key={organization.id} 
              organization={organization} 
              onClick={() => {
                setModalOrganization(organization)
                setIsOpen(true)
              }} />
          ))
        }
      </div>

      <div className="relative items-center text-center isolate px-6 mt-20 pt-0 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-0 lg:py-20">
          <div className="shiba-2 mx-auto w-40 max-w-40">
            <img className="" src="shiba-2-body.png" />
            <div className="shiba-2-eye"></div>
            <div className="shiba-2-star-1"></div>
            <div className="shiba-2-star-2"></div>
            <div className="shiba-2-star-3"></div>
            <div className="shiba-2-star-4"></div>
            <div className="shiba-2-star-5"></div>
          </div>
          <h1 id="statistics" className="text-4xl font-bold tracking-tighter text-yellow-950 sm:text-6xl mt-10">Making a difference!</h1>
          <p className="my-6 text-xl leading-8 text-slate-600">
            Thanks to your generosity, we&apos;ve been able to donate <span className="text-red-500 font-bold">{donated.toLocaleString()}</span> to <span className="text-red-500 font-bold">24</span> charities and counting, all while burning <span className="text-red-500 font-bold">{(donated/100).toLocaleString()}</span> BONK to make our community even stronger!
          </p>

          <div className="justify-center grid grid-cols-1 lg:grid-cols-3 gap-4 text-center my-4 mt-8">
              <div className="flex flex-col items-center justify-center border border-yellow-900 bg-yellow-950 bg-opacity-5 border-opacity-10 rounded-lg p-2 px-3">
                <h2 className="text-2xl font-bold tracking-tight text-yellow-900 sm:text-2xl truncate w-full">{(donated).toLocaleString()}</h2>
                <p className="text-gray-700" >Donated</p>
              </div>
              <div className="flex flex-col items-center justify-center border border-yellow-900 bg-yellow-950 bg-opacity-5 border-opacity-10 rounded-lg p-2 px-3">
                <h2 className="text-2xl font-bold tracking-tight text-yellow-900 sm:text-2xl">{ (donated / 100).toLocaleString()}</h2>
                <p className="text-gray-700">Burnt</p>
              </div>
              <div className="flex flex-col items-center justify-center border border-yellow-900 bg-yellow-950 bg-opacity-5 border-opacity-10 rounded-lg p-2 px-3">
                <h2 className="text-lg font-bold tracking-tight text-yellow-900 sm:text-2xl">24</h2>
                <p className="text-gray-700">Charities</p>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}  
