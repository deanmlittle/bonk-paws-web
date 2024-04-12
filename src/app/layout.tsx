"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import { WalletAdapter } from "./contexts/WalletAdapter";
import Footer from "./components/Footer";
import { useState, createContext } from "react";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

const herborn = localFont({
  src: [
    {
      path: "../../public/fonts/Herborn.ttf",
      weight: "400",
    },
  ],
  variable: "--font-herborn",
});

const metadata: Metadata = {
  title: "BONK for PAWS",
  description:
    "We're matching donations to animal-related causes 1:1, only on $BONK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="en">
      <WalletAdapter>
        <body className={`${herborn.variable} gradient-bg-white`}>
          {children}
          <Header />
          <Footer />
        </body>
      </WalletAdapter>
    </html>
  );
}
