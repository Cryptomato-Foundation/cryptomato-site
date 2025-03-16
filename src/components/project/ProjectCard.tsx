import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CryptoProject } from '@/lib/store/cryptoStore';
import TomatoRating from '../ui/TomatoRating';

interface ProjectCardProps {
  project: CryptoProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/project/${project.id}`} className="block">
        <div className="relative h-48 w-full">
          <Image 
            src={project.coverImage || '/placeholder-project.jpg'} 
            alt={project.name}
            fill
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
};

export default ProjectCard; 