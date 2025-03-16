/**
 * ProjectDetail Component
 * 
 * Displays detailed information about a specific crypto project.
 * This is a server component for rendering project details.
 */

import React from 'react';
import Image from 'next/image';
import { CryptoProject } from '@/lib/data/crypto-projects';
import TomatoRating from '../ui/TomatoRating';

/**
 * Props for the ProjectDetail component
 */
interface ProjectDetailProps {
  /** The crypto project to display details for */
  project: CryptoProject;
}

/**
 * ProjectDetail displays comprehensive information about a crypto project
 */
export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Project header with banner image */}
      <div className="relative h-64 w-full">
        <Image 
          src={project.coverImage || '/placeholder-project.jpg'} 
          alt={project.name}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex items-center gap-4 mb-2">
            <TomatoRating rating={project.tomatoRating} size="lg" className="bg-black/50 p-1 rounded text-white" />
            <span className="text-white font-medium text-sm">{project.ratingCount} reviews</span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-bold">{project.name}</h1>
        </div>
      </div>
      
      {/* Project details */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">About {project.name}</h2>
          <p className="text-gray-700">{project.description}</p>
        </div>
        
        {/* Additional details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Key Information</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex justify-between">
                <span>Launched:</span>
                <span className="font-medium">2023</span>
              </li>
              <li className="flex justify-between">
                <span>Category:</span>
                <span className="font-medium">DeFi</span>
              </li>
              <li className="flex justify-between">
                <span>Blockchain:</span>
                <span className="font-medium">Ethereum</span>
              </li>
              <li className="flex justify-between">
                <span>Token:</span>
                <span className="font-medium">Yes (ERC-20)</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Community Score</h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    project.tomatoRating >= 60 ? 'bg-[var(--fresh)]' : 'bg-[var(--rotten)]'
                  }`}
                  style={{ width: `${project.tomatoRating}%` }}
                  role="progressbar"
                  aria-valuenow={project.tomatoRating}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <span className="ml-3 font-bold">{project.tomatoRating}%</span>
            </div>
          </div>
        </div>
        
        {/* Review section placeholder */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-gray-500 text-center">Reviews coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail; 