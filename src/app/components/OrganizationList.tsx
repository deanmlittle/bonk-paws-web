'use client';
import React, { useEffect, useState } from 'react';
import OrganizationCard from "./OrganizationCard";
import DonationHistory from "./donationHistory";
import { Organization } from '@/types';
import Modal from '@/app/components/Modal';
import { ShortOrganization } from '@/types';

const OrganizationList: React.FC<{}> = () => {
    const [modalOrganization, setModalOrganization] = React.useState<Organization | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const [search, setSearch] = useState("");
    const [wantReceipt, setWantReceipt] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');

    console.log(search);
    useEffect(()=>{
        const getAnimalCharityList = async () => {
            try{
                const res = await fetch(`http://localhost:4500/api/getAnimalCharityList`);
                const json = await res.json();
                
                setOrganizations(json.charity);
                return json;
            }catch(err){
                console.log(err);
            }
        }
        getAnimalCharityList();

    },[])
    return (
      <div>
        {modalOrganization && <Modal organization={modalOrganization}  isOpen={isOpen} setIsOpen={setIsOpen} wantReceipt={wantReceipt} />}
        {/* <DonationHistory isOpen={isHistoryOpen} setIsOpen={setIsHistoryOpen}/> */}

        <div className='flex flex-nowrap justify-center items-center'>
          <input className='text-black p-3 rounded w-[600px]' type="text" id="search" placeholder="Search for Charities..." onChange={(e) => setSearch(e.target.value)} />
          <button className="ml-4 bg-red-500 hover:bg-red-400 text-white font-semibold py-3 px-5 border border-red-600 hover:border-red-600 rounded-lg" onClick={() => setIsHistoryOpen(true)}>Donation History</button>
        </div>
        <div className='mt-2 flex flex-nowrap justify-center items-center'>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={wantReceipt} 
              onChange={(e) => setWantReceipt(e.target.checked)} 
              className="form-checkbox" 
            />
            <span className="ml-2 text-gray-600">Do you need a Receipt?</span>
          </label>
        </div>

        <div id="charities" className="grid grid-cols-1 mt-20 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-20">
          {organizations.map((organization: ShortOrganization) => {
            const shouldShow = wantReceipt ? 
              organization.isReceiptEnabled === true: 
              organization.allowsAnon === true;
            return shouldShow ? (
              <OrganizationCard 
                key={organization.id}
                organization={organization}
                onClick={() => {
                  setModalOrganization(organization);
                  setIsOpen(true);
                }}
              />
            ) : null;
          })}
        </div>
      </div>
    )
}

export default OrganizationList