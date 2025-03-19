'use client';

/**
 * Authentication Provider Component
 * 
 * Client component that initializes Particle Network SDK and provides
 * authentication context to the application.
 */

import { useEffect, useState } from 'react';
import { initParticle } from '@/lib/auth/particle';
import { useAuthStore } from '@/lib/store/auth-store';

/**
 * AuthProvider component props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication provider component
 * Initializes Particle Network and checks authentication status
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Initialize Particle Network with a slight delay to ensure DOM is ready
    const initAuth = async () => {
      try {
        console.log('[AuthProvider] Initializing Particle Network...');
        
        // Small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const particle = initParticle();
        
        if (particle) {
          console.log('[AuthProvider] Particle Network initialized successfully');
          // Check if user is already authenticated
          const isAuthenticated = await checkAuth();
          console.log('[AuthProvider] Authentication check completed, isAuthenticated:', isAuthenticated);
        } else {
          console.warn('[AuthProvider] Particle Network initialization failed or running on server');
        }
      } catch (error) {
        console.error('[AuthProvider] Error initializing auth:', error);
      } finally {
        console.log('[AuthProvider] Initialization completed, setting isInitialized to true');
        setIsInitialized(true);
      }
    };
    
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return <>{children}</>;
}

export default AuthProvider; 