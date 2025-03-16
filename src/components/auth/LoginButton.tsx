'use client';

/**
 * Login Button Component
 * 
 * Client component that handles login/signup with Particle Network.
 * Shows a login button or user profile based on authentication state.
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/auth-store';

/**
 * Login button component
 */
export function LoginButton() {
  const { login, logout, user, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Handle error display and clearing
  useEffect(() => {
    if (error) {
      setLoginError(error);
      
      // Auto-clear error after 5 seconds
      const timer = setTimeout(() => {
        clearError();
        setLoginError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);
  
  /**
   * Handle login button click
   */
  const handleLogin = async () => {
    try {
      setLoginError(null);
      await login();
    } catch (error) {
      console.error('Login component error:', error);
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError('Failed to login. Please try again.');
      }
    }
  };
  
  /**
   * Handle logout button click
   */
  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError('Failed to logout. Please try again.');
      }
    }
  };
  
  /**
   * Toggle user menu
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <button
        className="bg-white text-[var(--primary)] font-semibold py-1 px-4 rounded-full opacity-75"
        disabled
      >
        <span className="animate-pulse">CONNECTING...</span>
      </button>
    );
  }
  
  // If authenticated, show user profile
  if (isAuthenticated && user) {
    return (
      <div className="relative">
        {/* User avatar/profile button */}
        <button
          onClick={toggleMenu}
          className="rounded-full overflow-hidden border-2 border-white focus:outline-none focus:ring-2 focus:ring-white"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
        >
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name || 'User profile'}
              width={36}
              height={36}
              className="rounded-full"
            />
          ) : (
            <div className="bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center">
              <span className="text-[var(--primary)] font-bold">
                {user.name?.charAt(0) || user.wallet_address.charAt(2)}
              </span>
            </div>
          )}
        </button>
        
        {/* User menu dropdown */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                <p className="font-medium">{user.name || 'Crypto User'}</p>
                <p className="text-xs truncate text-gray-500">
                  {user.wallet_address}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Not authenticated, show login button
  return (
    <div className="relative">
      <button
        onClick={handleLogin}
        className="bg-white text-[var(--primary)] font-semibold py-1 px-4 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Login or signup"
      >
        LOGIN/SIGNUP
      </button>
      
      {/* Error message */}
      {loginError && (
        <div className="absolute right-0 mt-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md text-xs max-w-[240px] z-50">
          {loginError}
        </div>
      )}
    </div>
  );
}

export default LoginButton; 