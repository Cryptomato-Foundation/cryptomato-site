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
import { CryptoProject, searchProjects } from '@/lib/data/crypto-projects';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Load projects based on search query
  const loadSearchResults = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filteredProjects = await searchProjects(query);
      setResults(filteredProjects);
      setTotalCount(filteredProjects.length); // For client-side search, total count is the result length
    } catch (error) {
      console.error('Error loading search results:', error);
      setError('Failed to load search results. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);
  
  // Load results when query changes
  useEffect(() => {
    loadSearchResults();
  }, [query, loadSearchResults]);
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search results heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {query ? `Search Results: ${query}` : 'All Projects'}
          </h1>
          {isLoading ? (
            <p className="text-gray-600 mt-1">
              Searching...
            </p>
          ) : error ? (
            <p className="text-red-500 mt-1">
              {error}
              <button 
                onClick={loadSearchResults}
                className="ml-2 text-blue-500 underline"
              >
                Try Again
              </button>
            </p>
          ) : (
            <p className="text-gray-600 mt-1">
              {query
                ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                : 'Browse all crypto projects and see their Cryptomato score'
              }
            </p>
          )}
        </div>
        
        {/* Projects list */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        ) : (
          <ProjectList initialProjects={results} totalCount={totalCount} searchQuery={query} />
        )}
      </div>
      
      <Footer />
    </main>
  );
} 