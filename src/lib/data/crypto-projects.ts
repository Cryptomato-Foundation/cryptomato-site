/**
 * Mock data for crypto projects
 * 
 * This file contains static mock data for crypto projects used during development.
 * In a production environment, this would be replaced with data from an API or database.
 */

export interface CryptoProject {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  tomatoRating: number; // Percentage (0-100)
  ratingCount: number;
  isTrending: boolean;
}

/**
 * Mock data for crypto projects
 */
export const CRYPTO_PROJECTS: CryptoProject[] = [
  {
    id: '1',
    name: 'Bitcoin',
    description: 'The original cryptocurrency that started it all.',
    coverImage: '/projects/bitcoin.png',
    tomatoRating: 84, // 84% (Fresh)
    ratingCount: 254,
    isTrending: true,
  },
  {
    id: '2',
    name: 'Ethereum',
    description: 'Smart contract platform enabling decentralized applications.',
    coverImage: '/projects/ethereum.png',
    tomatoRating: 91, // 91% (Fresh)
    ratingCount: 187,
    isTrending: true,
  },
  {
    id: '3',
    name: 'Solana',
    description: 'High-performance blockchain with fast transaction speeds.',
    coverImage: '/projects/solana.png',
    tomatoRating: 78, // 78% (Fresh)
    ratingCount: 143,
    isTrending: true,
  },
  {
    id: '4',
    name: 'Dogecoin',
    description: 'Meme cryptocurrency with a passionate community.',
    coverImage: '/projects/dogecoin.png',
    tomatoRating: 55, // 55% (Rotten)
    ratingCount: 203,
    isTrending: false,
  },
  {
    id: '5',
    name: 'Cardano',
    description: 'Proof-of-stake blockchain platform with academic rigor.',
    coverImage: '/projects/cardano.png',
    tomatoRating: 82, // 82% (Fresh)
    ratingCount: 121,
    isTrending: false,
  },
  {
    id: '6',
    name: 'Polkadot',
    description: 'Multi-chain network enabling cross-chain communication.',
    coverImage: '/projects/polkadot.png',
    tomatoRating: 76, // 76% (Fresh)
    ratingCount: 98,
    isTrending: false,
  },
  {
    id: '7',
    name: 'Shiba Inu',
    description: 'Ethereum-based meme coin and ecosystem.',
    coverImage: '/projects/shiba.png',
    tomatoRating: 42, // 42% (Rotten)
    ratingCount: 176,
    isTrending: true,
  },
  {
    id: '8',
    name: 'Avalanche',
    description: 'Fast smart contracts platform with high throughput.',
    coverImage: '/projects/avalanche.png',
    tomatoRating: 79, // 79% (Fresh)
    ratingCount: 87,
    isTrending: false,
  },
  {
    id: '9',
    name: 'Chainlink',
    description: 'Decentralized oracle network powering smart contracts.',
    coverImage: '/projects/chainlink.png',
    tomatoRating: 88, // 88% (Fresh)
    ratingCount: 112,
    isTrending: false,
  },
  {
    id: '10',
    name: 'PooCoin',
    description: 'Fictional low-quality meme token.',
    coverImage: '/projects/poocoin.png',
    tomatoRating: 12, // 12% (Very Rotten)
    ratingCount: 63,
    isTrending: false,
  },
];

/**
 * Get all projects
 * @returns Array of all crypto projects
 */
export function getAllProjects(): CryptoProject[] {
  return CRYPTO_PROJECTS;
}

/**
 * Get trending projects
 * @returns Array of trending crypto projects
 */
export function getTrendingProjects(): CryptoProject[] {
  return CRYPTO_PROJECTS.filter(project => project.isTrending);
}

/**
 * Get a project by ID
 * @param id - The project ID to find
 * @returns A project or undefined if not found
 */
export function getProjectById(id: string): CryptoProject | undefined {
  return CRYPTO_PROJECTS.find(project => project.id === id);
}

/**
 * Search projects by query
 * @param query - The search query
 * @returns Filtered array of crypto projects
 */
export function searchProjects(query: string): CryptoProject[] {
  if (!query) return CRYPTO_PROJECTS;
  
  const lowercaseQuery = query.toLowerCase();
  return CRYPTO_PROJECTS.filter(project => 
    project.name.toLowerCase().includes(lowercaseQuery) || 
    project.description.toLowerCase().includes(lowercaseQuery)
  );
} 