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
 * ProjectList displays a grid of crypto projects with infinite scroll
 */
export function ProjectList({ projects, searchQuery = '' }: ProjectListProps) {
  const [displayedProjects, setDisplayedProjects] = useState<CryptoProject[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement>(null);
  
  // Filter projects based on search query
  const filteredProjects = useCallback(() => {
    if (!searchQuery) return projects;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(lowercaseQuery) || 
      project.description.toLowerCase().includes(lowercaseQuery)
    );
  }, [projects, searchQuery]);
  
  /**
   * Load more projects when scrolling
   */
  const loadMoreProjects = useCallback(() => {
    const filtered = filteredProjects();
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = page * ITEMS_PER_PAGE;
    const newProjects = filtered.slice(start, end);
    
    if (newProjects.length > 0) {
      setDisplayedProjects(prev => [...prev, ...newProjects]);
      setPage(prevPage => prevPage + 1);
    }
    
    if (end >= filtered.length) {
      setHasMore(false);
    }
  }, [page, filteredProjects]);
  
  // Reset when search query or projects change
  useEffect(() => {
    setDisplayedProjects([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery, projects]);
  
  // Initial load
  useEffect(() => {
    loadMoreProjects();
  }, [searchQuery, projects, loadMoreProjects]);
  
  // Setup intersection observer for infinite scroll
  useEffect(() => {
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
  }, [hasMore, loadMoreProjects]);
  
  const currentFilteredProjects = filteredProjects();
  
  if (currentFilteredProjects.length === 0) {
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
        {displayedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
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