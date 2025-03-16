'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useCryptoStore from '@/lib/store/cryptoStore';
import Navbar from '@/components/layout/Navbar';
import ProjectDetail from '@/components/project/ProjectDetail';

export default function ProjectPage() {
  const params = useParams();
  const { projects, selectProject, selectedProject, clearSelectedProject } = useCryptoStore();
  
  const projectId = params.id as string;
  
  // Load project on mount
  useEffect(() => {
    if (projectId) {
      selectProject(projectId);
    }
    
    // Clear selected project on unmount
    return () => {
      clearSelectedProject();
    };
  }, [projectId, selectProject, clearSelectedProject]);
  
  // If project not found or loading
  if (!selectedProject) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading project...</h1>
          <p className="text-gray-600">
            {projects.length > 0 
              ? "Looking for this project..."
              : "No projects available"
            }
          </p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <ProjectDetail project={selectedProject} />
      </div>
      
      {/* Footer could be extracted as a component for reuse */}
      <footer className="bg-[var(--secondary)] text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Cryptomato. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
} 