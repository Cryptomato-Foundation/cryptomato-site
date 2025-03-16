'use client';

/**
 * SearchInput Component
 * 
 * A client component for handling search input and navigation.
 * This component handles search queries and navigates to the search page.
 */

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

/**
 * SearchInput displays a search box that navigates to the search page
 */
export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Update local state when URL query changes
  useEffect(() => {
    // Only synchronize if we're on the search page
    if (pathname === '/search') {
      setSearchQuery(searchParams.get('q') || '');
    }
  }, [searchParams, pathname]);
  
  /**
   * Handles search input changes
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  /**
   * Handles search form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-md mx-4"
    >
      <input 
        type="text"
        placeholder="Search for a crypto project..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full py-2 px-4 pr-10 rounded-full bg-white text-black focus:outline-none"
        aria-label="Search crypto projects"
      />
      <button 
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        aria-label="Search"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </button>
    </form>
  );
}

export default SearchInput; 