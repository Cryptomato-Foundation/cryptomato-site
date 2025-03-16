/**
 * ProjectCard Component
 * 
 * Displays a card for a crypto project in a grid layout.
 * This is a server component as it doesn't need client-side interactivity.
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CryptoProject } from '@/lib/data/crypto-projects';
import TomatoRating from '../ui/TomatoRating';

/**
 * Props for the ProjectCard component
 */
interface ProjectCardProps {
  /** The crypto project to display */
  project: CryptoProject;
}

/**
 * ProjectCard displays summary information about a crypto project
 */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/project/${project.id}`} className="block" aria-label={`View details for ${project.name}`}>
        <div className="relative h-48 w-full">
          <Image 
            src={project.coverImage || '/placeholder-project.jpg'} 
            alt={project.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
          {/* Rating badge overlay */}
          <div className="absolute bottom-2 left-2 z-10">
            <TomatoRating rating={project.tomatoRating} size="md" className="bg-black/70 p-1 rounded text-white" />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{project.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
          
          <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
            <span>{project.ratingCount} reviews</span>
            <span>
              {project.tomatoRating >= 60 ? (
                <span className="text-[var(--fresh)]">Fresh</span>
              ) : (
                <span className="text-[var(--rotten)]">Rotten</span>
              )}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProjectCard; 