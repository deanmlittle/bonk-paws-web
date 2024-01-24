"use client";

import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { ScriptProps } from 'next/script';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletAdapter: FC<ScriptProps> = ({ children }) => {
    // const network = "http://localhost:8899";
    // const network = "https://solana-mainnet.g.alchemy.com/v2/wt0qZh4IKo8U5zs1Puj0S9CfTR-r2CAM";
    const network = "https://api.mainnet-beta.solana.com";

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter()
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {/* <WalletMultiButton /> */}
                    {/* <WalletDisconnectButton /> */}
                    { children }
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};