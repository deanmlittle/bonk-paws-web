'use client';

import { Organization } from '@/types';
import Image from 'next/image'
// import { useState } from 'react';

const OrganizationCard: React.FC<{ organization: Organization, onClick: (organization: Organization) => void }> = ({ organization, onClick }) => {
    // const [isReady, setIsReady] = useState(false);
  
    return (
      <button className="custom-orange-bg border border-yellow-300 p-4 transition-all rounded-lg shadow hover:shadow-yellow-200 hover:shadow-lg" onClick={() => {
        onClick(organization)
        }}>
        <div className="col-span-1 text-center border-top border-left border-right border-yellow-400 rounded-lg transition-all">
          <div className="border-b border-orange-100 h-48 bg-white rounded-lg w-90 h-48">
            <img className="object-contain h-48 w-96 py-5" width={320} height={180} src={organization.logo} alt={organization.name} />
          </div>
          <div className="px-6 py-4">
            <div className="font-bold tracking-tighter text-xl mb-2 text-yellow-950">{organization.name}</div>
            <button className="bg-red-500 hover:bg-red-400 text-white font-bold mt-10 py-2 px-4 rounded">
              Donate
            </button>
          </div>
        </div>
      </button>
    );
  };
  
  export default OrganizationCard;