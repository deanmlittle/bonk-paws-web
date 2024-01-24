'use client';

import React, { useEffect, useState } from "react"
import WalletButton from "./WalletButton";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import Loader from "./Loader";

const Balance = () => {
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ balance, setBalance ] = useState(0);
   

    useEffect(() => {
        const getBalance = async (publicKey: PublicKey) => {
            if(!isLoading) {
                setIsLoading(true);
                try {
                    const ata = console.log(getAssociatedTokenAddressSync(new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"), publicKey));
                    const balance = undefined
                    setBalance(balance?.value?.uiAmount || 0)
                } catch(e) {
                    console.log(e);
                    setBalance(0);
                }
                setIsLoading(false);
            }
        }
        if (publicKey) {        
            let timer = setTimeout(async () => { await getBalance(publicKey) }, 15000);

            return () => {
                clearTimeout(timer);
              };
        }
    }, [isLoading, publicKey]);

    if (!publicKey) return

    return (
        <span className="flex">
            <div className="flex my-auto">
                { (isLoading) ?
                    <Loader />
                :
                    <span className="text-medium text-lg font-medium text-red-500 my-auto">
                    {balance.toLocaleString()}
                    </span>
                }
            </div>
            <img 
              src="/logo.png" 
              alt="BONK" 
              className="h-8 w-8 ml-2 my-auto" 
            />
        </span>
    )
}

const Header: React.FC<{}> = () => {
    const { publicKey, disconnect } = useWallet();
    const { setVisible: setModalVisible } = useWalletModal()
    const openWalletModal = () => {
      setModalVisible(true)
    }
    return (
    <header className="absolute inset-x-0 top-0 z-30">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
                <a href="/" className="-m-1.5 p-1.5">
                    <img className="h-10 w-auto" src="logo-horizontal.png" alt="BONK PAWS" />
                </a>
            </div>
            <div className="flex justify-end">
                { publicKey ? <Balance /> : <WalletButton onClick={openWalletModal} />  }
            </div>
        </nav>
    </header>
    )
}

export default Header;