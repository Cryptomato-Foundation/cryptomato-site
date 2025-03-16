/**
 * Supabase Client Configuration
 * 
 * Creates and exports a Supabase client instance for use throughout the application.
 * Environment variables are used to configure the client.
 */

import { createClient } from '@supabase/supabase-js';

// Validate environment variables are present
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create regular Supabase client with anon key for public operations
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Create an admin client with service role key for operations that need to bypass RLS
// This client should only be used server-side
const createAdminClient = () => {
  if (typeof window !== 'undefined') {
    console.warn('Admin client should not be created on the client side');
    return null;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing required environment variables for admin client');
  }
  
  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

/**
 * Get user by wallet address
 * @param walletAddress The user's wallet address
 * @returns The user record or null if not found
 */
export async function getUserByWalletAddress(walletAddress: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
    console.error('Error fetching user by wallet address:', error);
    throw error;
  }
  
  return data;
}

/**
 * Create a new user in the database
 * This function requires special Supabase permissions and will be handled by a server action
 * @param userData User data to insert
 * @returns The created user
 */
export async function createUser(userData: {
  id?: string;
  wallet_address: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  particle_uuid?: string;
}) {
  try {
    // For client-side createUser, we need to make a fetch request to our API endpoint
    // that will use the server-side admin client
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
      
      return await response.json();
    } else {
      // This code path is for server-side only (API routes)
      const adminClient = createAdminClient();
      if (!adminClient) {
        throw new Error('Admin client not available');
      }
      
      const { data, error } = await adminClient
        .from('users')
        .insert([userData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update an existing user in the database
 * @param id User ID
 * @param userData Data to update
 * @returns The updated user
 */
export async function updateUser(
  id: string,
  userData: Partial<{
    wallet_address: string;
    email: string;
    name: string;
    avatar_url: string;
    particle_uuid: string;
  }>
) {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }
  
  return data;
} 