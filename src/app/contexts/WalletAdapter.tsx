"use client";

import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { ScriptProps } from 'next/script';
import { RPC_URL } from '@/constants';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletAdapter: FC<ScriptProps> = ({ children }) => {
    // const network = "http://localhost:8899";
    // const network = "https://solana-mainnet.g.alchemy.com/v2/wt0qZh4IKo8U5zs1Puj0S9CfTR-r2CAM";
    // const network = "https://multi-compatible-dream.solana-mainnet.quiknode.pro/ab10715a148f3ffb855f7e7665821f318f1c2cb8/";
    // const network = "https://api.mainnet-beta.solana.com";


    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter()
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={RPC_URL}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    { children }
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};