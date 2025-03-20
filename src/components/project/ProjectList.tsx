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
import TagFilters from '../ui/TagFilters';

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
  /** Optional array of tags for filtering */
  tags?: string[];
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
 * Loading skeleton for project cards
 */
function ProjectCardSkeleton() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
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
  );
}

/**
 * Grid of loading skeletons
 */
function LoadingSkeletons({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}

/**
 * ProjectList displays a grid of crypto projects with infinite scroll
 */
export function ProjectList({ initialProjects, totalCount, searchQuery = '', tags = [] }: ProjectListProps) {
  const [displayedProjects, setDisplayedProjects] = useState<Array<CryptoProject & { _key?: string }>>([]);
  const [filteredProjects, setFilteredProjects] = useState<Array<CryptoProject & { _key?: string }>>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newItemsCount, setNewItemsCount] = useState(0);
  const loader = useRef<HTMLDivElement>(null);
  const gridEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize with initial projects
  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      // Add unique keys to each project
      const projectsWithKeys = initialProjects.map((project, index) => ({
        ...project,
        _key: getProjectKey(project, index)
      }));
      
      setDisplayedProjects(projectsWithKeys);
      setFilteredProjects(projectsWithKeys);
      setPage(2); // Start at page 2 for next load
      setHasMore(initialProjects.length < totalCount);
      setIsInitialLoad(false);
    } else {
      setIsInitialLoad(false);
    }
  }, [initialProjects, totalCount]);
  
  // Apply tag filters when selectedTags changes
  useEffect(() => {
    if (selectedTags.length > 0) {
      const filtered = displayedProjects.filter(project => 
        project.tag_names && 
        Array.isArray(project.tag_names) && 
        // Project should have at least one of the selected tags
        project.tag_names.some(tag => selectedTags.includes(tag))
      );
      setFilteredProjects(filtered);
    } else {
      // No tags selected, show all projects
      setFilteredProjects(displayedProjects);
    }
  }, [selectedTags, displayedProjects]);
  
  // Handler for tag selection changes
  const handleTagsChange = (newSelectedTags: string[]) => {
    setSelectedTags(newSelectedTags);
    // Scroll to top of grid when changing filters
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
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
      
      // Short delay to make the transition smoother
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remember how many new items we're adding for animation purposes
      setNewItemsCount(projectsWithKeys.length);
      
      setDisplayedProjects(prev => [...prev, ...projectsWithKeys]);
      setPage(prevPage => prevPage + 1);
      setHasMore(nextPageProjects.length === DEFAULT_PAGE_SIZE);
      
      // Scroll to show the first new item if loading was triggered by button
      setTimeout(() => {
        setNewItemsCount(0); // Reset new items count
      }, 1000);
    } catch (error) {
      console.error('[ProjectList] Error loading more projects:', error);
      setError('Failed to load more projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);
  
  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '200px', // Load earlier for smoother experience
      threshold: 0.1
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
  
  // Extract unique tags from all displayed projects
  const projectTags = Array.from(new Set(
    displayedProjects
      .filter(project => project.tag_names && Array.isArray(project.tag_names))
      .flatMap(project => project.tag_names || [])
  )).slice(0, 20); // Limit to 20 most common tags for now
  
  // Show loading state during initial load
  if (isInitialLoad) {
    return (
      <div className="py-4">
        <div className="h-12 bg-gray-200 animate-pulse rounded-full mb-6"></div>
        <LoadingSkeletons count={8} />
      </div>
    );
  }
  
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
  
  // Determine index where new items begin for animation
  const newItemsStartIndex = filteredProjects.length - newItemsCount;
  
  return (
    <div className="py-4">
      {/* Tag filters */}
      {projectTags.length > 0 && (
        <TagFilters 
          tags={tags.length > 0 ? tags : projectTags} 
          selectedTags={selectedTags} 
          onTagsChange={handleTagsChange}
        />
      )}
      
      <div className="mt-4 transition-all duration-300 ease-in-out">
        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => {
            // Use the precomputed key or generate a new one
            const key = project._key || getProjectKey(project, index);
            // Omit our internal _key property from the props
            const { _key, ...projectProps } = project;
            // Check if this is one of the newly loaded items
            const isNewItem = newItemsCount > 0 && index >= newItemsStartIndex;
            
            return (
              <div key={key} className={isNewItem ? 'opacity-0 animate-[fadeInUp_0.5s_forwards_0.3s]' : ''}>
                <ProjectCard project={projectProps as CryptoProject} />
              </div>
            );
          })}
        </div>
        <div ref={gridEndRef}></div>
        
        {/* Empty state when filtered projects are empty */}
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-xl font-semibold">No projects match the selected tags</h3>
            <p className="text-gray-500 mt-2">
              Try selecting different tags or view all projects
            </p>
          </div>
        )}
      </div>
      
      {/* Load more section */}
      {hasMore && filteredProjects.length > 0 && (
        <div 
          ref={loader} 
          className="pt-10 pb-4 flex flex-col items-center justify-center" 
          aria-label="Loading more projects"
        >
          {isLoading ? (
            <div className="w-full">
              <p className="text-center text-gray-500 mb-4">Loading more projects...</p>
              <LoadingSkeletons count={4} />
            </div>
          ) : (
            <button 
              onClick={loadMoreProjects}
              className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:scale-105 active:scale-95 transform duration-200"
            >
              Load more projects
            </button>
          )}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="text-center py-6 my-4 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => loadMoreProjects()} 
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* End of results message */}
      {!hasMore && filteredProjects.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the list</p>
        </div>
      )}
    </div>
  );
}

export default ProjectList; 