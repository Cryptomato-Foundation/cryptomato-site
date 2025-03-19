/**
 * Home Page Component
 * 
 * The main landing page for the Cryptomato website.
 * This is a server component that loads data and passes it to client components.
 */

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProjects, getTrendingProjects } from '@/lib/data/crypto-projects';
import Navbar from '@/components/layout/Navbar';
import HeroCarousel from '@/components/ui/HeroCarousel';
import ProjectList from '@/components/project/ProjectList';
import Footer from '@/components/layout/Footer';

/**
 * Loading component for ProjectList
 */
function ProjectListFallback() {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 w-full bg-gray-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded mb-1 w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-4/5"></div>
              <div className="mt-3 flex justify-between">
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/5"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Home page component
 */
export default function Home() {
  // Get data from server-side functions
  const allProjects = getAllProjects();
  const trendingProjects = getTrendingProjects();
  
  // Debug log for projects data
  console.log('[HomePage] All projects fetched:', 
    allProjects.map(p => ({id: p.id, name: p.name}))
  );
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero section with carousel */}
      <section>
        <Suspense fallback={
          <div className="w-full h-[400px] bg-gray-800 animate-pulse flex items-center justify-center">
            <p className="text-white text-xl">Loading featured projects...</p>
          </div>
        }>
          <HeroCarousel projects={trendingProjects} />
        </Suspense>
      </section>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Section heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Crypto Projects</h2>
          <p className="text-gray-600 mt-1">
            Browse all crypto projects and see their Cryptomato score
          </p>
        </div>
        
        {/* Projects list with infinite scroll */}
        <Suspense fallback={<ProjectListFallback />}>
          <ProjectList projects={allProjects} />
        </Suspense>
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
