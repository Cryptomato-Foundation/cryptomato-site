'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useCryptoStore from '@/lib/store/cryptoStore';
import Navbar from '@/components/layout/Navbar';
import HeroCarousel from '@/components/ui/HeroCarousel';
import ProjectList from '@/components/project/ProjectList';

export default function Home() {
  const { projects, trendingProjects, searchQuery } = useCryptoStore();
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero section with carousel */}
      <section>
        <HeroCarousel projects={trendingProjects} />
      </section>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Section heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {searchQuery ? `Search Results: ${searchQuery}` : 'All Crypto Projects'}
          </h2>
          <p className="text-gray-600 mt-1">
            {searchQuery 
              ? `Showing results for "${searchQuery}"`
              : 'Browse all crypto projects and see their Cryptomato score'
            }
          </p>
        </div>
        
        {/* Projects list with infinite scroll */}
        <ProjectList projects={projects} searchQuery={searchQuery} />
      </div>
      
      {/* Footer */}
      <footer className="bg-[var(--secondary)] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="text-white font-bold text-xl flex items-center gap-2">
                <Image 
                  src="/cryptomato-logo.svg" 
                  alt="Cryptomato"
                  width={30} 
                  height={30}
                  className="object-contain"
                />
                <span>Cryptomato</span>
              </Link>
              <p className="text-gray-400 mt-2 text-sm">
                The trusted source for crypto project reviews
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Explore</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/exchanges" className="hover:text-white">Exchanges</Link></li>
                  <li><Link href="/projects" className="hover:text-white">Projects</Link></li>
                  <li><Link href="/vc" className="hover:text-white">VC</Link></li>
                  <li><Link href="/agency" className="hover:text-white">Agency</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/defi" className="hover:text-white">DeFi</Link></li>
                  <li><Link href="/nft" className="hover:text-white">NFT</Link></li>
                  <li><Link href="/gamefi" className="hover:text-white">GameFi</Link></li>
                  <li><Link href="/meme" className="hover:text-white">Meme Coins</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">About</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Cryptomato. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
