import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useCryptoStore from '@/lib/store/cryptoStore';

const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useCryptoStore();

  return (
    <header>
      {/* Main navbar */}
      <div className="bg-[var(--primary)] py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-white font-bold text-2xl flex items-center gap-2">
            <Image 
              src="/cryptomato-logo.svg" 
              alt="Cryptomato"
              width={40} 
              height={40}
              className="object-contain"
            />
            <span>Cryptomato</span>
          </Link>
          
          {/* Search bar */}
          <div className="relative w-full max-w-md mx-4">
            <input 
              type="text"
              placeholder="Search for a crypto project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-full bg-white text-black focus:outline-none"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/exchanges" className="nav-link">Exchanges</Link>
            <Link href="/projects" className="nav-link">Projects</Link>
            <Link href="/vc" className="nav-link">VC</Link>
            <Link href="/agency" className="nav-link">Agency</Link>
          </nav>
          
          {/* Login button */}
          <button className="bg-white text-[var(--primary)] font-semibold py-1 px-4 rounded-full hover:bg-gray-100 transition-colors">
            LOGIN/SIGNUP
          </button>
        </div>
      </div>
      
      {/* Secondary navbar */}
      <div className="bg-[var(--secondary)] text-white py-2">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center md:justify-start space-x-6 overflow-x-auto">
            <Link href="/trending" className="whitespace-nowrap hover:opacity-80 text-sm font-medium">TRENDING ON CT</Link>
            <Link href="/defi" className="whitespace-nowrap hover:opacity-80 text-sm">DeFi</Link>
            <Link href="/nft" className="whitespace-nowrap hover:opacity-80 text-sm">NFT</Link>
            <Link href="/gamefi" className="whitespace-nowrap hover:opacity-80 text-sm">GameFi</Link>
            <Link href="/meme" className="whitespace-nowrap hover:opacity-80 text-sm">Meme Coins</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 