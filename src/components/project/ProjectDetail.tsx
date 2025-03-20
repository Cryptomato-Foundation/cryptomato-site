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
 * Format a date string to a readable format
 */
function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
}

/**
 * Get the website URL from project data
 */
function getWebsiteUrl(project: CryptoProject): string | null {
  if (project.urls?.website && project.urls.website.length > 0) {
    return project.urls.website[0];
  }
  return null;
}

/**
 * ProjectDetail displays comprehensive information about a crypto project
 */
export function ProjectDetail({ project }: ProjectDetailProps) {
  const websiteUrl = getWebsiteUrl(project);
  const rating = project.tomatoRating || 50; // Default to 50 if undefined
  const ratingCount = project.ratingCount || 0; // Default to 0 if undefined
  
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
            <TomatoRating rating={rating} size="lg" className="bg-black/50 p-1 rounded text-white" />
            <span className="text-white font-medium text-sm">{ratingCount} reviews</span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-bold">{project.name}</h1>
          <div className="flex items-center gap-2 text-white/80 mt-1">
            <span className="font-medium bg-gray-800/50 px-2 py-0.5 rounded text-sm">{project.symbol}</span>
            {project.category && (
              <span className="text-sm">{project.category}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Project details */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">About {project.name}</h2>
          <p className="text-gray-700">{project.description || 'No description available.'}</p>
          
          {websiteUrl && (
            <a 
              href={websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-600 hover:underline"
            >
              Visit Website →
            </a>
          )}
        </div>
        
        {/* Additional details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Key Information</h3>
            <ul className="space-y-1 text-sm text-gray-600 border rounded-md divide-y">
              <li className="flex justify-between p-2">
                <span>Symbol:</span>
                <span className="font-medium">{project.symbol}</span>
              </li>
              {project.date_launched && (
                <li className="flex justify-between p-2">
                  <span>Launched:</span>
                  <span className="font-medium">{formatDate(project.date_launched)}</span>
                </li>
              )}
              {project.twitter_username && (
                <li className="flex justify-between p-2">
                  <span>Twitter:</span>
                  <a 
                    href={`https://twitter.com/${project.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    @{project.twitter_username}
                  </a>
                </li>
              )}
              {project.subreddit && (
                <li className="flex justify-between p-2">
                  <span>Reddit:</span>
                  <a 
                    href={`https://reddit.com/r/${project.subreddit}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    r/{project.subreddit}
                  </a>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Community Score</h3>
            <div className="flex items-center mb-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    rating >= 60 ? 'bg-[var(--fresh)]' : 'bg-[var(--rotten)]'
                  }`}
                  style={{ width: `${rating}%` }}
                  role="progressbar"
                  aria-valuenow={rating}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <span className="ml-3 font-bold">{rating}%</span>
            </div>
            
            {project.tag_names && project.tag_names.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tag_names.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
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