import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cryptomato - Multi-Chain DeFi Platform",
  description: "Seamless cross-chain DeFi platform powered by LayerZero Protocol",
  keywords: ["crypto", "defi", "blockchain", "layerzero", "cross-chain", "web3"],
  authors: [{ name: "Cryptomato Foundation" }],
  openGraph: {
    title: "Cryptomato - Multi-Chain DeFi Platform",
    description: "Seamless cross-chain DeFi platform powered by LayerZero Protocol",
    url: "https://cryptomato.io",
    siteName: "Cryptomato",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cryptomato - Multi-Chain DeFi Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cryptomato - Multi-Chain DeFi Platform",
    description: "Seamless cross-chain DeFi platform powered by LayerZero Protocol",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
