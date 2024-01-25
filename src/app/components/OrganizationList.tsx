'use client';
import React, { useEffect, useState } from 'react';
import OrganizationCard from "./OrganizationCard";
import { Organization } from '@/types';
import Modal from '@/app/components/Modal';
import { ShortOrganization } from '@/types';

const OrganizationList: React.FC<{}> = () => {
    const [modalOrganization, setModalOrganization] = React.useState<Organization | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const [search, setSearch] = useState("");
    console.log(search);
    useEffect(()=>{
        const getAnimalCharityList = async () => {
            try{
                const res = await fetch(`http://localhost:4500/api/getAnimalCharityList`);
                const json = await res.json();
                // console.log(json.charity);
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
        {modalOrganization && <Modal organization={modalOrganization}  isOpen={isOpen} setIsOpen={setIsOpen} />}
        <div className='flex flex-wrap justify-center'>
          <input className='text-black mx-20 sm:mt-10 lg:mt-0 p-3 rounded w-1/2' type="text" id = "search"  placeholder="Search for Charities..."
            onChange={(e)=>setSearch(e.target.value)}/>
          <div id="charities" className=" grid grid-cols-1 mt-20 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-20">
            {
              organizations.filter((organizations: ShortOrganization)=> {
                return search.toLowerCase() === '' ? organizations : organizations.name.toLowerCase().includes(search);
              }).map((organization) => (
                <OrganizationCard 
                  key= {organization["id"]}
                  organization={organization} 
                  onClick={() => {
                    setModalOrganization(organization)
                    setIsOpen(true)
                  }} />
              ))
            }
          </div>
        </div>
        
      </div>
    )
}

export default OrganizationList