import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CryptoProject } from '@/lib/store/cryptoStore';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
  projects: CryptoProject[];
  searchQuery?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, searchQuery = '' }) => {
  const [displayedProjects, setDisplayedProjects] = useState<CryptoProject[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement>(null);
  
  const ITEMS_PER_PAGE = 8;
  
  // Filter projects based on search query
  const filteredProjects = searchQuery 
    ? projects.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;
  
  // Load more projects when scrolling
  const loadMoreProjects = useCallback(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = page * ITEMS_PER_PAGE;
    const newProjects = filteredProjects.slice(start, end);
    
    if (newProjects.length > 0) {
      setDisplayedProjects(prev => [...prev, ...newProjects]);
      setPage(prevPage => prevPage + 1);
    }
    
    if (end >= filteredProjects.length) {
      setHasMore(false);
    }
  }, [page, filteredProjects]);
  
  // Reset when search query changes
  useEffect(() => {
    setDisplayedProjects([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);
  
  // Initial load
  useEffect(() => {
    loadMoreProjects();
  }, [searchQuery, loadMoreProjects]);
  
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
  
  if (filteredProjects.length === 0) {
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
        <div ref={loader} className="py-8 flex justify-center">
          <div className="animate-pulse flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList; 