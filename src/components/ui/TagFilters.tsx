'use client';

/**
 * TagFilters Component
 * 
 * Displays a horizontal scrollable list of tag filters for crypto projects.
 * Users can click on tags to filter the project list.
 * Supports multiple selection and toggling tags on/off.
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TagFiltersProps {
  /** Array of available tags */
  tags: string[];
  /** Array of currently selected tags */
  selectedTags: string[];
  /** Callback when tags selection changes */
  onTagsChange: (tags: string[]) => void;
}

export function TagFilters({ tags, selectedTags, onTagsChange }: TagFiltersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check if arrows should be shown
  const checkScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  // Handle scroll on arrow click
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 250; // Adjust as needed
    const newScrollLeft = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount
      : scrollRef.current.scrollLeft + scrollAmount;
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove tag if already selected
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      // Add tag if not selected
      onTagsChange([...selectedTags, tag]);
    }
  };

  // Clear all selected tags
  const clearAllTags = () => {
    onTagsChange([]);
  };

  // Listen for scroll events
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Check initial scroll state
      checkScroll();
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, []);

  // Reset scroll when tags change
  useEffect(() => {
    checkScroll();
  }, [tags]);

  if (!tags.length) return null;

  return (
    <div className="relative py-4">
      {/* Left scroll arrow */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Tags container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-2 gap-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* "All" tag option */}
        <button
          onClick={clearAllTags}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border border-gray-200 
            ${selectedTags.length === 0 ? 'bg-black text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
          aria-pressed={selectedTags.length === 0}
        >
          All
        </button>

        {/* Tag filters */}
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border border-gray-200 
              ${selectedTags.includes(tag) ? 'bg-black text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            aria-pressed={selectedTags.includes(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Right scroll arrow */}
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default TagFilters; 