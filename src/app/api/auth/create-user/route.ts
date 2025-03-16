/**
 * API Route for Creating Users
 * 
 * This route uses the Supabase service role key to bypass RLS policies
 * and create new users in the database.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Validate and get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing required environment variables for Supabase admin client');
}

// Create admin client with service role key
const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const userData = await request.json();
    
    // Validate required fields
    if (!userData.wallet_address) {
      return NextResponse.json(
        { error: 'Missing required field: wallet_address is required' },
        { status: 400 }
      );
    }
    
    // Check if a user with this wallet address already exists
    const { data: existingUser, error: lookupError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('wallet_address', userData.wallet_address)
      .maybeSingle();
    
    if (lookupError) {
      console.error('Error looking up existing user:', lookupError);
      return NextResponse.json(
        { error: `Error checking for existing user: ${lookupError.message}` },
        { status: 500 }
      );
    }
    
    // If user already exists, return it
    if (existingUser) {
      console.log('User already exists, returning existing user');
      return NextResponse.json(existingUser);
    }
    
    // Generate a new UUID for the user if one wasn't provided
    const userId = userData.id || uuidv4();
    
    // Insert user with admin privileges that bypass RLS
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([{
        id: userId,
        wallet_address: userData.wallet_address,
        email: userData.email || null,
        name: userData.name || null,
        avatar_url: userData.avatar_url || null,
        particle_uuid: userData.particle_uuid || null,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('API error creating user:', error);
      return NextResponse.json(
        { error: `Error creating user: ${error.message}` },
        { status: 500 }
      );
    }
    
    // Return the created user
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 