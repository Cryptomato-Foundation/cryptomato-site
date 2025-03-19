'use client';

/**
 * ProjectList Component
 * 
 * Displays a grid of crypto projects with infinite scroll functionality.
 * This is a client component as it uses React hooks for state management, 
 * effects, and the Intersection Observer API.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { CryptoProject } from '@/lib/data/crypto-projects';
import ProjectCard from './ProjectCard';

/**
 * Props for the ProjectList component
 */
interface ProjectListProps {
  /** Array of projects to display */
  projects: CryptoProject[];
  /** Optional search query to filter projects */
  searchQuery?: string;
}

/**
 * Number of items to load per page for infinite scroll
 */
const ITEMS_PER_PAGE = 8;

/**
 * Ensure a project has a valid ID for React keys
 */
function getProjectKey(project: CryptoProject, index: number): string {
  // Use the project id if it exists and is a string
  if (project && project.id && typeof project.id === 'string' && project.id.trim() !== '') {
    return project.id;
  }
  // Fallback to a synthetic key
  return `project-${index}-${Date.now()}`;
}

/**
 * ProjectList displays a grid of crypto projects with infinite scroll
 */
export function ProjectList({ projects, searchQuery = '' }: ProjectListProps) {
  const [displayedProjects, setDisplayedProjects] = useState<Array<CryptoProject & { _key?: string }>>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [initialized, setInitialized] = useState(false); // Track initial load
  const [resetCounter, setResetCounter] = useState(0); // Counter to force resets
  const loader = useRef<HTMLDivElement>(null);
  
  // Filter projects based on search query
  const filteredProjects = useCallback(() => {
    // Defensive check for projects array
    if (!Array.isArray(projects)) {
      console.warn('[ProjectList] projects is not an array:', projects);
      return [];
    }
    
    if (!searchQuery) return projects;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(lowercaseQuery) || 
      project.description.toLowerCase().includes(lowercaseQuery)
    );
  }, [projects, searchQuery]);
  
  // Reset everything when projects or search changes
  useEffect(() => {
    // Completely reset state when source data changes
    console.log('[ProjectList] Source data changed, resetting state');
    setDisplayedProjects([]);
    setPage(1);
    setHasMore(true);
    setInitialized(false);
    setResetCounter(c => c + 1); // Increment reset counter to trigger other effects
  }, [projects, searchQuery]);
  
  // Load initial data once on component mount or after reset
  useEffect(() => {
    const loadInitial = async () => {
      // Avoid concurrent loads
      if (initialized) return;
      
      try {
        setInitialized(true); // Mark as initialized to prevent duplicate loads
        
        const filtered = filteredProjects();
        console.log('[ProjectList] Loading initial projects:', filtered.length);
        
        // Add unique keys to each project
        const projectsWithKeys = filtered
          .slice(0, ITEMS_PER_PAGE)
          .map((project, index) => ({
            ...project,
            _key: getProjectKey(project, index)
          }));
        
        setDisplayedProjects(projectsWithKeys);
        setPage(2); // Start at page 2 for next load
        setHasMore(filtered.length > ITEMS_PER_PAGE);
      } catch (error) {
        console.error('[ProjectList] Error loading initial projects:', error);
        setInitialized(true); // Still mark as initialized to prevent infinite retries
      }
    };
    
    loadInitial();
  }, [filteredProjects, resetCounter, initialized]);
  
  // Load more projects when scrolling
  const loadMoreProjects = useCallback(() => {
    // Check if we're in a valid state to load more
    if (!initialized || !hasMore) return;
    
    try {
      const filtered = filteredProjects();
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = page * ITEMS_PER_PAGE;
      const nextProjects = filtered.slice(start, end);
      
      if (nextProjects.length > 0) {
        // Add unique keys to each project
        const projectsWithKeys = nextProjects.map((project, index) => ({
          ...project,
          _key: getProjectKey(project, start + index)
        }));
        
        setDisplayedProjects(prev => [...prev, ...projectsWithKeys]);
        setPage(prevPage => prevPage + 1);
      }
      
      setHasMore(end < filtered.length);
    } catch (error) {
      console.error('[ProjectList] Error loading more projects:', error);
    }
  }, [page, filteredProjects, hasMore, initialized]);
  
  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!initialized) return;
    
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProjects();
      }
    }, options);
    
    if (loader.current) {
      observer.observe(loader.current);
    }
    
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore, loadMoreProjects, initialized]);
  
  const currentFilteredProjects = filteredProjects();
  
  if (!Array.isArray(currentFilteredProjects) || currentFilteredProjects.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-semibold">No projects found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search query</p>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProjects.map((project, index) => {
          // Use the precomputed key or generate a new one
          const key = project._key || getProjectKey(project, index);
          // Omit our internal _key property from the props
          const { _key, ...projectProps } = project;
          return (
            <ProjectCard 
              key={key} 
              project={projectProps as CryptoProject} 
            />
          );
        })}
      </div>
      
      {/* Loading indicator */}
      {hasMore && (
        <div ref={loader} className="py-8 flex justify-center" aria-label="Loading more projects">
          <div className="animate-pulse flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectList; 