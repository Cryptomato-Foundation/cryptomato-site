/**
 * Particle Network Authentication Service
 * 
 * This module handles authentication with Particle Network to create account abstraction wallets.
 * It initializes the Particle SDK and provides methods for login, logout, and getting user info.
 */

import { ParticleNetwork } from '@particle-network/auth';
import { ParticleProvider } from '@particle-network/provider';
import { getUserByWalletAddress, createUser } from '../supabase';

// Initialize Particle Network
let particle: ParticleNetwork | null = null;

/**
 * Initialize Particle Network SDK
 * Must be called on the client side
 */
export function initParticle() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (particle) {
    return particle;
  }

  // Validate environment variables
  if (
    !process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY ||
    !process.env.NEXT_PUBLIC_PARTICLE_APP_ID
  ) {
    throw new Error('Missing Particle Network environment variables');
  }

  // Create Particle Network instance
  particle = new ParticleNetwork({
    projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID,
    clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY,
    appId: process.env.NEXT_PUBLIC_PARTICLE_APP_ID,
    chainName: 'ethereum', // Default chain, can be changed
    chainId: 1, // Ethereum mainnet
  });

  return particle;
}

/**
 * Get Particle provider for Web3 interactions
 * @returns ParticleProvider instance
 */
export function getParticleProvider() {
  const particleInstance = initParticle();
  if (!particleInstance) {
    throw new Error('Particle Network not initialized');
  }
  
  return new ParticleProvider(particleInstance.auth);
}

/**
 * Get wallet address for a specific chain
 * @param particleInstance The Particle Network instance
 * @param chainName The chain name to get wallet for
 * @returns The wallet address or null if not found
 */
function getWalletAddressForChain(particleInstance: ParticleNetwork, chainName: string): string | null {
  try {
    // Access the user info directly
    const userInfo = particleInstance.auth.getUserInfo();
    
    // Directly access the first wallet's address as a fallback
    if (userInfo && userInfo.wallets && userInfo.wallets.length > 0) {
      // First try to find the matching chain wallet
      const matchingWallet = userInfo.wallets.find(
        (wallet) => wallet.chain_name.toLowerCase() === chainName.toLowerCase()
      );
      
      if (matchingWallet && matchingWallet.public_address) {
        return matchingWallet.public_address;
      }
      
      // If no matching chain wallet, use the first available wallet
      return userInfo.wallets[0].public_address || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return null;
  }
}

/**
 * Login with Particle Network
 * @param chainName Optional chain to connect to
 * @param chainId Optional chain ID to connect to
 * @returns User data including wallet info
 */
export async function loginWithParticle(chainName = 'ethereum', chainId = 1) {
  try {
    const particleInstance = initParticle();
    if (!particleInstance) {
      throw new Error('Particle Network not initialized');
    }

    // Login with Particle (opens social login modal)
    const userInfo = await particleInstance.auth.login();
    console.log('Particle login successful:', userInfo);
    
    // Wait a moment for wallet to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try getting the wallet address
    let walletAddress = getWalletAddressForChain(particleInstance, chainName);
    
    // If still no wallet address, try alternative method
    if (!walletAddress) {
      console.log('First attempt to get wallet address failed, trying alternative method...');
      // Try up to 3 times with a delay between attempts
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try getting the address directly from auth
        try {
          const address = particleInstance.auth.getUserInfo()?.wallets[0]?.public_address;
          if (address) {
            walletAddress = address;
            console.log('Found wallet address on retry:', walletAddress);
            break;
          }
        } catch (e) {
          console.warn('Retry attempt failed:', e);
        }
      }
    }

    if (!walletAddress) {
      throw new Error('No wallet address found after login. Please try again.');
    }

    console.log('Retrieved wallet address:', walletAddress);

    // Create or get the user in Supabase using our API endpoint
    console.log('Creating/getting user in Supabase with wallet:', walletAddress);
    
    try {
      const userData = {
        wallet_address: walletAddress,
        email: userInfo.email,
        name: userInfo.name,
        avatar_url: userInfo.avatar,
        particle_uuid: userInfo.uuid,
      };
      
      const user = await createUser(userData);
      console.log('User data from createUser:', user);
      
      return {
        ...user,
        walletAddress, // Include walletAddress for convenience
      };
    } catch (error) {
      console.error('Error creating/getting user in Supabase:', error);
      throw new Error(`Authentication successful but user creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error logging in with Particle:', error);
    throw error;
  }
}

/**
 * Logout from Particle Network
 */
export async function logoutFromParticle() {
  try {
    const particleInstance = initParticle();
    if (!particleInstance) {
      throw new Error('Particle Network not initialized');
    }
    
    await particleInstance.auth.logout();
    return true;
  } catch (error) {
    console.error('Error logging out from Particle:', error);
    throw error;
  }
}

/**
 * Check if user is logged in to Particle Network
 * @returns Boolean indicating if user is logged in
 */
export function isLoggedInToParticle() {
  try {
    const particleInstance = initParticle();
    if (!particleInstance) {
      return false;
    }
    
    return particleInstance.auth.isLogin();
  } catch (error) {
    return false;
  }
}

/**
 * Get current user info from Particle Network
 * @returns User info or null if not logged in
 */
export function getParticleUserInfo() {
  try {
    const particleInstance = initParticle();
    if (!particleInstance || !particleInstance.auth.isLogin()) {
      return null;
    }
    
    return particleInstance.auth.getUserInfo();
  } catch (error) {
    console.error('Error getting Particle user info:', error);
    return null;
  }
} 