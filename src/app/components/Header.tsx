"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import WalletButton from "./WalletButton";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey } from "@solana/web3.js";
import Loader from "./Loader";
import DonationHistory from "./DonationHistory";
import Image from "next/image";
import { RPC_URL } from "@/constants";
import Link from "next/link";

const Balance = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getBalance = async (publicKey: PublicKey) => {
      if (!isLoading) {
        setIsLoading(true);
        try {
          await connection
            .getBalance(publicKey, "processed")
            .then((b) => setBalance(b / 1e9));
        } catch (e) {
          console.log(e);
          setBalance(0);
        }
        setIsLoading(false);
      }
    };

    let timer: NodeJS.Timeout;

    const fetchData = async () => {
      if (publicKey) {
        await getBalance(publicKey);
        timer = setTimeout(fetchData, 15000); // Execute every 25 seconds
      }
    };

    fetchData(); // Initial execution

    return () => {
      clearTimeout(timer);
    };
  }, [publicKey]);

  if (!publicKey) return;

  return (
    <span className="flex">
      <div className="flex my-auto">
        {isLoading ? (
          <Loader />
        ) : (
          <span className="text-medium text-lg font-medium text-bonk-orange my-auto">
            {balance.toLocaleString()}
          </span>
        )}
      </div>
      <img src="/sol.png" alt="sol" className="h-6 w-6 ml-2 my-auto" />
    </span>
  );
};

const Header: React.FC<{}> = () => {
  const { publicKey, disconnect } = useWallet();
  const { setVisible: setModalVisible } = useWalletModal();
  const openWalletModal = () => {
    setModalVisible(true);
  };
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  return (
    <>
      <DonationHistory isOpen={isHistoryOpen} setIsOpen={setIsHistoryOpen} />
      <header className="absolute inset-x-0 top-0 z-30">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <img
                className="h-10 w-auto"
                src="/logo-horizontal.png"
                alt="BONK for PAWS"
              />
            </Link>
          </div>
          <div className="flex justify-end">
            {publicKey ? (
              <div className="flex items-center space-x-4 md:space-x-6">
                <Balance />
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setIsHistoryOpen(true)}
                >
                  <Image
                    src="/history.svg"
                    width={24}
                    height={24}
                    alt="History Icon"
                  />
                  <span className="text-yellow-950">History</span>
                </div>
              </div>
            ) : (
              <WalletButton onClick={openWalletModal} />
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
