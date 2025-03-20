'use client';

/**
 * ProjectList Component
 * 
 * Displays a grid of crypto projects with infinite scroll functionality.
 * This is a client component as it uses React hooks for state management, 
 * effects, and the Intersection Observer API.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { CryptoProject, getPaginatedProjects, DEFAULT_PAGE_SIZE } from '@/lib/data/crypto-projects';
import ProjectCard from './ProjectCard';

/**
 * Props for the ProjectList component
 */
interface ProjectListProps {
  /** Initial array of projects to display */
  initialProjects: CryptoProject[];
  /** Total count of projects in the database */
  totalCount: number;
  /** Optional search query to filter projects */
  searchQuery?: string;
}

/**
 * Ensure a project has a valid ID for React keys
 */
function getProjectKey(project: CryptoProject, index: number): string {
  // Use the project id if it exists
  if (project && project.id !== undefined) {
    return `project-${project.id}`;
  }
  // Fallback to a synthetic key
  return `project-${index}-${Date.now()}`;
}

/**
 * ProjectList displays a grid of crypto projects with infinite scroll
 */
export function ProjectList({ initialProjects, totalCount, searchQuery = '' }: ProjectListProps) {
  const [displayedProjects, setDisplayedProjects] = useState<Array<CryptoProject & { _key?: string }>>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loader = useRef<HTMLDivElement>(null);
  
  // Initialize with initial projects
  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      // Add unique keys to each project
      const projectsWithKeys = initialProjects.map((project, index) => ({
        ...project,
        _key: getProjectKey(project, index)
      }));
      
      setDisplayedProjects(projectsWithKeys);
      setPage(2); // Start at page 2 for next load
      setHasMore(initialProjects.length < totalCount);
    }
  }, [initialProjects, totalCount]);
  
  // Load more projects from the server
  const loadMoreProjects = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`[ProjectList] Loading page ${page} from server...`);
      const nextPageProjects = await getPaginatedProjects(page, DEFAULT_PAGE_SIZE);
      
      if (nextPageProjects.length === 0) {
        setHasMore(false);
        return;
      }
      
      // Add unique keys to each project
      const projectsWithKeys = nextPageProjects.map((project, index) => ({
        ...project,
        _key: getProjectKey(project, (page - 1) * DEFAULT_PAGE_SIZE + index)
      }));
      
      setDisplayedProjects(prev => [...prev, ...projectsWithKeys]);
      setPage(prevPage => prevPage + 1);
      setHasMore(displayedProjects.length + nextPageProjects.length < totalCount);
    } catch (error) {
      console.error('[ProjectList] Error loading more projects:', error);
      setError('Failed to load more projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, displayedProjects.length, totalCount]);
  
  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
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
  }, [hasMore, loadMoreProjects, isLoading]);
  
  // Show empty state when no projects are available
  if (!displayedProjects || displayedProjects.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-semibold">No projects found</h3>
        <p className="text-gray-500 mt-2">
          {searchQuery ? 'Try adjusting your search query' : 'Projects will appear here once available'}
        </p>
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
      
      {/* Error message */}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => loadMoreProjects()} 
            className="mt-2 text-blue-500 underline"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* End of results message */}
      {!hasMore && displayedProjects.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the list</p>
        </div>
      )}
    </div>
  );
}

export default ProjectList; 