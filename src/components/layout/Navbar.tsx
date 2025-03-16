/**
 * Navbar Component
 * 
 * The main navigation bar for the Cryptomato website.
 * This is a server component that includes a client-side SearchInput component
 * to handle search functionality.
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchInput from './SearchInput';

/**
 * Site navigation categories
 */
const CATEGORIES = [
  { name: 'TRENDING ON CT', href: '/trending' },
  { name: 'DeFi', href: '/defi' },
  { name: 'NFT', href: '/nft' },
  { name: 'GameFi', href: '/gamefi' },
  { name: 'Meme Coins', href: '/meme' },
];

/**
 * Main navigation links
 */
const NAV_LINKS = [
  { name: 'Exchanges', href: '/exchanges' },
  { name: 'Projects', href: '/projects' },
  { name: 'VC', href: '/vc' },
  { name: 'Agency', href: '/agency' },
];

/**
 * Navbar component for site-wide navigation
 */
export function Navbar() {
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
              priority // Important for LCP
            />
            <span>Cryptomato</span>
          </Link>
          
          {/* Search bar - Client component */}
          <SearchInput />
          
          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.href}
                href={link.href} 
                className="nav-link"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Login button */}
          <button 
            className="bg-white text-[var(--primary)] font-semibold py-1 px-4 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Login or signup"
          >
            LOGIN/SIGNUP
          </button>
        </div>
      </div>
      
      {/* Secondary navbar */}
      <div className="bg-[var(--secondary)] text-white py-2">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center md:justify-start space-x-6 overflow-x-auto">
            {CATEGORIES.map(category => (
              <Link 
                key={category.href}
                href={category.href} 
                className={`whitespace-nowrap hover:opacity-80 text-sm ${category.name === 'TRENDING ON CT' ? 'font-medium' : ''}`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar; 