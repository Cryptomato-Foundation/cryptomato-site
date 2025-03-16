/**
 * Project Detail Page
 * 
 * Displays detailed information about a specific crypto project.
 * This is a server component that loads data server-side.
 */

import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/data/crypto-projects';
import Navbar from '@/components/layout/Navbar';
import ProjectDetail from '@/components/project/ProjectDetail';
import Footer from '@/components/layout/Footer';

/**
 * Props for the ProjectPage component
 */
interface ProjectPageProps {
  params: {
    id: string;
  };
}

/**
 * Project detail page component
 */
export default function ProjectPage({ params }: ProjectPageProps) {
  const projectId = params.id;
  const project = getProjectById(projectId);
  
  // If project not found, return 404
  if (!project) {
    notFound();
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <ProjectDetail project={project} />
      </div>
      
      <Footer minimal />
    </main>
  );
}

/**
 * Generate metadata for the project page
 */
export async function generateMetadata({ params }: ProjectPageProps) {
  const projectId = params.id;
  const project = getProjectById(projectId);
  
  if (!project) {
    return {
      title: 'Project Not Found - Cryptomato',
      description: 'The requested crypto project could not be found.',
    };
  }
  
  return {
    title: `${project.name} - Cryptomato`,
    description: project.description,
  };
} 