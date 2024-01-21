'use client';
import React, { useEffect, useState } from 'react';
import OrganizationCard from "./OrganizationCard";
import { Organization } from '@/types';
import Modal from '@/app/components/Modal';

const OrganizationList: React.FC<{}> = () => {
    const [modalOrganization, setModalOrganization] = React.useState<Organization | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    useEffect(()=>{
        const getAnimalCharityList = async () => {
            try{
                const res = await fetch(`http://localhost:4500/api/getAnimalCharityList`);
                const json = await res.json();
                console.log(json.charity);
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
        <Modal organization={modalOrganization}  isOpen={isOpen} setIsOpen={setIsOpen} />
        <div id="charities" className="flex flex-wrap justify-center grid grid-cols-1 mt-20 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-20">
        {
          organizations.map((organization) => (
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
    )
}

export default OrganizationList