/**
 * Crypto Store - Client-side state management
 * 
 * This module provides a Zustand store for managing client-side state related to crypto projects.
 * It leverages data from the crypto-projects module but maintains client-specific state like
 * search queries and selected projects.
 */

import { create } from 'zustand';
import { CryptoProject, CRYPTO_PROJECTS, searchProjects } from '@/lib/data/crypto-projects';

/**
 * Interface for the Crypto Store state and actions
 */
interface CryptoStore {
  // State
  searchQuery: string;
  selectedProject: CryptoProject | null;
  
  // Computed properties (these are calculated on access)
  get projects(): CryptoProject[];
  get trendingProjects(): CryptoProject[];
  get filteredProjects(): CryptoProject[];
  
  // Actions
  setSearchQuery: (query: string) => void;
  selectProject: (id: string) => void;
  clearSelectedProject: () => void;
}

/**
 * Zustand store for managing crypto project state on the client
 * 
 * Note: In a real application, this would be enhanced with API calls
 * to fetch real-time data from a backend service.
 */
const useCryptoStore = create<CryptoStore>((set, get) => ({
  // Initial state
  searchQuery: '',
  selectedProject: null,
  
  // Computed properties
  get projects() {
    return CRYPTO_PROJECTS;
  },
  
  get trendingProjects() {
    return CRYPTO_PROJECTS.filter(project => project.isTrending);
  },
  
  get filteredProjects() {
    const { searchQuery } = get();
    return searchProjects(searchQuery);
  },
  
  // Actions
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  
  selectProject: (id: string) => {
    const project = CRYPTO_PROJECTS.find(p => p.id === id) || null;
    set({ selectedProject: project });
  },
  
  clearSelectedProject: () => set({ selectedProject: null }),
}));

export default useCryptoStore;
export type { CryptoProject }; 