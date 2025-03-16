import React from 'react';
import Image from 'next/image';

interface TomatoRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  className?: string;
}

const TomatoRating: React.FC<TomatoRatingProps> = ({ 
  rating, 
  size = 'md', 
  showScore = true, 
  className = ''
}) => {
  // Determine the rating type
  const isFresh = rating >= 60; // Fresh if 60% or higher
  const isRotten = rating < 60 && rating > 0; // Rotten if under 60%
  const isNotRated = rating === 0; // Not rated yet
  
  // Size mappings for the tomato icon
  const sizeMap = {
    sm: 20,
    md: 30,
    lg: 40
  };
  
  const iconSize = sizeMap[size];
  
  // CSS classes for the container based on size
  const containerClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  return (
    <div className={`flex items-center gap-1 ${containerClasses[size]} ${className}`}>
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
              alt="Fresh"
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
              alt="Rotten"
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
};

export default TomatoRating; 