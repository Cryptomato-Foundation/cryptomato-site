/**
 * Crypto Projects Data Interface and Functions
 * 
 * This file contains types and functions for working with cryptocurrency project data.
 * Data is fetched from Supabase database.
 */

import { supabase } from '../supabase';

/**
 * Crypto Project data structure from Supabase
 */
export interface CryptoProject {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  category?: string;
  description?: string;
  logo?: string;
  subreddit?: string;
  notice?: string;
  twitter_username?: string;
  date_added?: string;
  date_launched?: string;
  is_hidden?: number;
  infinite_supply?: boolean;
  tags?: any[];
  tag_names?: string[];
  tag_groups?: any[];
  urls?: {
    website?: string[];
    twitter?: string[];
    reddit?: string[];
    message_board?: string[];
    chat?: string[];
    explorer?: string[];
    technical_doc?: string[];
    source_code?: string[];
    announcement?: string[];
  };
  platform?: any;
  contract_address?: any[];
  self_reported_circulating_supply?: number;
  self_reported_tags?: any[];
  self_reported_market_cap?: number;
  metadata?: any;
  last_updated?: string;
  
  // UI specific fields (not in database)
  tomatoRating?: number; // Will be added in future
  ratingCount?: number;  // Will be added in future
  coverImage?: string;   // Placeholder for now
}

/**
 * Default page size for pagination
 */
export const DEFAULT_PAGE_SIZE = 8;

/**
 * Get paginated crypto projects
 * @param page - Page number (1-based)
 * @param pageSize - Number of items per page
 * @returns Array of crypto projects for the requested page
 */
export async function getPaginatedProjects(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const start = (page - 1) * pageSize;
  
  try {
    const { data, error } = await supabase
      .from('crypto_projects')
      .select('*')
      .range(start, start + pageSize - 1)
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching paginated projects:', error);
      throw error;
    }
    
    // Add placeholder cover images
    const projectsWithCovers = data.map(project => ({
      ...project,
      // Use placeholder image with project name/symbol
      coverImage: `https://placehold.co/600x400/273849/FFFFFF/png?text=${project.symbol || project.name}`,
      // Placeholder values for UI - will be replaced in future
      tomatoRating: 50 + Math.floor(Math.random() * 50), // Random 50-100 for now
      ratingCount: 10 + Math.floor(Math.random() * 90), // Random 10-100 for now
    }));
    
    return projectsWithCovers;
  } catch (error) {
    console.error('Error in getPaginatedProjects:', error);
    return [];
  }
}

/**
 * Get total count of crypto projects
 * @returns Total number of crypto projects in the database
 */
export async function getTotalProjectCount() {
  try {
    const { count, error } = await supabase
      .from('crypto_projects')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching project count:', error);
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getTotalProjectCount:', error);
    return 0;
  }
}

/**
 * Get crypto project by ID
 * @param id - Project ID
 * @returns Project data or null if not found
 */
export async function getProjectById(id: number) {
  try {
    const { data, error } = await supabase
      .from('crypto_projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching project by ID:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Add UI placeholder data
    return {
      ...data,
      coverImage: `https://placehold.co/600x400/273849/FFFFFF/png?text=${data.symbol || data.name}`,
      tomatoRating: 50 + Math.floor(Math.random() * 50),
      ratingCount: 10 + Math.floor(Math.random() * 90),
    };
  } catch (error) {
    console.error('Error in getProjectById:', error);
    return null;
  }
}

/**
 * Get all projects (legacy function, transitioning to pagination)
 * 
 * @deprecated Use getPaginatedProjects instead
 * @returns Promise with array of all crypto projects
 */
export async function getAllProjects(): Promise<CryptoProject[]> {
  try {
    // Fetch first page with a larger page size for now
    // This is just for backward compatibility during transition
    return await getPaginatedProjects(1, 20);
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    return [];
  }
}

/**
 * Get trending projects
 * @returns Array of trending crypto projects
 * 
 * @deprecated Will be replaced with proper trending algorithm
 */
export async function getTrendingProjects(): Promise<CryptoProject[]> {
  try {
    // For now, just return the first few projects as "trending"
    // This will be replaced with proper trending logic later
    const projects = await getPaginatedProjects(1, 5);
    return projects;
  } catch (error) {
    console.error('Error in getTrendingProjects:', error);
    return [];
  }
}

/**
 * Search projects by query
 * @param query - The search query
 * @returns Filtered array of crypto projects
 * 
 * @deprecated Will be replaced with server-side search
 */
export async function searchProjects(query: string): Promise<CryptoProject[]> {
  try {
    if (!query) return await getAllProjects();
    
    // Basic client-side filtering for now
    // Will be replaced with proper server-side search
    const allProjects = await getAllProjects();
    const lowercaseQuery = query.toLowerCase();
    return allProjects.filter(project => 
      project.name.toLowerCase().includes(lowercaseQuery) || 
      (project.description && project.description.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error('Error in searchProjects:', error);
    return [];
  }
} 