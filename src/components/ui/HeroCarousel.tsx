'use client';

/**
 * HeroCarousel Component
 * 
 * A carousel/slider for displaying featured crypto projects on the homepage.
 * This is a client component as it uses React hooks for state management and effects.
 */

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CryptoProject } from '@/lib/data/crypto-projects';
import TomatoRating from './TomatoRating';

/**
 * Props for the HeroCarousel component
 */
interface HeroCarouselProps {
  /** Array of crypto projects to display in the carousel */
  projects: CryptoProject[];
}

/**
 * HeroCarousel displays a carousel of featured crypto projects
 */
export function HeroCarousel({ projects }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto advance carousel every 5 seconds
  useEffect(() => {
    if (projects.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [projects.length]);

  /**
   * Handle navigation to a specific slide
   */
  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  /**
   * Navigate to the previous slide
   */
  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current - 1 + projects.length) % projects.length);
  }, [projects.length]);
  
  /**
   * Navigate to the next slide
   */
  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % projects.length);
  }, [projects.length]);

  // Handle case with no projects
  if (projects.length === 0) {
    return (
      <div className="relative w-full h-[400px] bg-black flex items-center justify-center">
        <p className="text-white text-xl">No trending projects found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] bg-black">
      {/* Carousel slides */}
      <div className="relative w-full h-full overflow-hidden">
        {projects.map((project, index) => (
          <div 
            key={project.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={index !== activeIndex}
          >
            {/* Background image with overlay */}
            <div className="relative w-full h-full">
              {/* Gradient overlay for improved text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gray-800">
                <Image 
                  src={project.coverImage || '/placeholder-project.jpg'}
                  alt={project.name}
                  fill
                  sizes="100vw"
                  className="object-cover opacity-60"
                  priority={index === 0} // Priority load the first image for LCP
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 z-20 p-8 w-full md:w-2/3">
              <div className="flex items-center mb-2">
                <TomatoRating rating={project.tomatoRating} size="md" className="bg-black/50 p-1 rounded" />
              </div>
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">{project.name}</h2>
              <p className="text-white text-sm md:text-base mb-4">{project.description}</p>
              <Link
                href={`/project/${project.id}`}
                className="inline-block bg-[var(--primary)] text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
                aria-label={`View ${project.name} details`}
              >
                View Project
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows - only show if there's more than one project */}
      {projects.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Indicator dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  index === activeIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HeroCarousel; 