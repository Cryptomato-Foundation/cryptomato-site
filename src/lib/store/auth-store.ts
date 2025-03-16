/**
 * Authentication Store
 * 
 * Global state management for user authentication using Zustand.
 * Handles user data, loading states, and authentication status.
 */

import { create } from 'zustand';
import { loginWithParticle, logoutFromParticle, isLoggedInToParticle, getParticleUserInfo } from '../auth/particle';

/**
 * User data structure
 */
export interface User {
  id: string;
  wallet_address: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  particle_uuid?: string;
}

/**
 * Authentication store state
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (chainName?: string, chainId?: number) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

/**
 * Authentication store
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  /**
   * Login with Particle Network
   */
  login: async (chainName = 'ethereum', chainId = 1) => {
    try {
      set({ isLoading: true, error: null });
      
      // Clear any previous errors
      console.log('Starting Particle login process...');
      
      const userData = await loginWithParticle(chainName, chainId);
      console.log('Login successful, user data:', userData);
      
      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Login error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to login',
        isLoading: false,
        isAuthenticated: false
      });
      
      // Rethrow to allow component to handle error
      throw error;
    }
  },
  
  /**
   * Logout from Particle Network
   */
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      
      await logoutFromParticle();
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to logout',
        isLoading: false,
      });
      
      // Rethrow to allow component to handle error
      throw error;
    }
  },
  
  /**
   * Check if user is already authenticated
   * @returns Boolean indicating if user is authenticated
   */
  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const isLoggedIn = isLoggedInToParticle();
      console.log('Auth check - logged in status:', isLoggedIn);
      
      if (isLoggedIn) {
        // If logged in, try to get user info including wallet
        const particleUserInfo = getParticleUserInfo();
        console.log('Particle user info from auth check:', particleUserInfo);
        
        if (particleUserInfo && particleUserInfo.wallets && particleUserInfo.wallets.length > 0) {
          const walletAddress = particleUserInfo.wallets[0].public_address;
          
          if (walletAddress) {
            // We have wallet address, set authenticated
            set({ 
              isAuthenticated: true,
              user: {
                id: particleUserInfo.uuid,
                wallet_address: walletAddress,
                email: particleUserInfo.email,
                name: particleUserInfo.name,
                avatar_url: particleUserInfo.avatar,
                particle_uuid: particleUserInfo.uuid
              }
            });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } else {
          set({ user: null, isAuthenticated: false });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
      
      set({ isLoading: false });
      return isLoggedIn;
    } catch (error) {
      console.error('Auth check error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to check authentication',
        isLoading: false,
        user: null,
        isAuthenticated: false,
      });
      return false;
    }
  },
  
  /**
   * Set user data directly
   */
  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },
  
  /**
   * Clear any authentication errors
   */
  clearError: () => {
    set({ error: null });
  }
})); 