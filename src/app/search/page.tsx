'use client';

/**
 * Search Page Component
 * 
 * Handles the display of search results for crypto projects.
 * This is a client component as it relies on the search query from the URL
 * and needs to fetch filtered data based on that query.
 */

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { CryptoProject, getAllProjects, searchProjects } from '@/lib/data/crypto-projects';
import Navbar from '@/components/layout/Navbar';
import ProjectList from '@/components/project/ProjectList';
import Footer from '@/components/layout/Footer';

/**
 * Search page component
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<CryptoProject[]>([]);
  
  // Filter projects when query changes
  const filterProjects = useCallback(() => {
    if (!query) {
      setResults(getAllProjects());
      return;
    }
    
    const filteredProjects = searchProjects(query);
    setResults(filteredProjects);
  }, [query]);
  
  // Update results when query changes
  useEffect(() => {
    filterProjects();
  }, [query, filterProjects]);
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search results heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {query ? `Search Results: ${query}` : 'All Projects'}
          </h1>
          <p className="text-gray-600 mt-1">
            {query
              ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
              : 'Browse all crypto projects and see their Cryptomato score'
            }
          </p>
        </div>
        
        {/* Projects list */}
        <ProjectList projects={results} />
      </div>
      
      <Footer />
    </main>
  );
} 