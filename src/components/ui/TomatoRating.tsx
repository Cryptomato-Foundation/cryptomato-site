/**
 * TomatoRating Component
 * 
 * Displays a visual rating indicator similar to Rotten Tomatoes' Tomatometer.
 * Shows fresh (red tomato) for ratings >= 60%, rotten (green splat) for < 60%,
 * and gray for unrated (0%).
 */

import React from 'react';
import Image from 'next/image';

/**
 * Props for the TomatoRating component
 */
interface TomatoRatingProps {
  /** Rating percentage (0-100) */
  rating: number;
  /** Size of the tomato icon */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the numerical score alongside the icon */
  showScore?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Size mapping for tomato icons
 */
const SIZE_MAP = {
  sm: 20,
  md: 30,
  lg: 40
} as const;

/**
 * CSS classes based on size
 */
const CONTAINER_CLASSES = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
} as const;

/**
 * TomatoRating component displays a rating indicator using tomato imagery
 */
export function TomatoRating({ 
  rating, 
  size = 'md', 
  showScore = true, 
  className = '' 
}: TomatoRatingProps) {
  // Determine the rating type
  const isFresh = rating >= 60; // Fresh if 60% or higher
  const isRotten = rating < 60 && rating > 0; // Rotten if under 60%
  const isNotRated = rating === 0; // Not rated yet
  
  const iconSize = SIZE_MAP[size];
  
  return (
    <div className={`flex items-center gap-1 ${CONTAINER_CLASSES[size]} ${className}`} aria-label={`Rating: ${rating}%`}>
      <div className="relative">
        {isNotRated && (
          // Gray tomato for not rated
          <div className="w-[30px] h-[30px] bg-[var(--gray)] rounded-full flex items-center justify-center">
            <span className="text-white text-[10px]">N/A</span>
          </div>
        )}
        
        {isFresh && (
          // Fresh (red) tomato
          <div className="w-[30px] h-[30px] bg-[var(--fresh)] rounded-full flex items-center justify-center">
            <Image 
              src="/tomato-fresh.svg" 
              alt="Fresh rating"
              width={iconSize} 
              height={iconSize}
              className="object-contain"
            />
          </div>
        )}
        
        {isRotten && (
          // Rotten (green splat) tomato
          <div className="w-[30px] h-[30px] bg-[var(--rotten)] rounded-full flex items-center justify-center">
            <Image 
              src="/tomato-rotten.svg" 
              alt="Rotten rating"
              width={iconSize} 
              height={iconSize}
              className="object-contain"
            />
          </div>
        )}
      </div>
      
      {showScore && (
        <span className="font-bold">{rating}%</span>
      )}
    </div>
  );
}

export default TomatoRating; 