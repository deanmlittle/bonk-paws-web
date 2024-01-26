'use client';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/app/components/Header'
import { WalletAdapter } from './contexts/WalletAdapter'
import Footer from './components/Footer';
import { useState, createContext } from 'react';


const inter = Inter({ subsets: ['latin'] })

const metadata: Metadata = {
  title: "BONK for PAWS",
  description: "We're matching donations to animal-related causes 1:1, only on $BONK",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="en">
      <WalletAdapter>
        <body className={inter.className}>{children}
          <Header />
          <Footer/>
        </body>
      </WalletAdapter>
    </html>
  )
}