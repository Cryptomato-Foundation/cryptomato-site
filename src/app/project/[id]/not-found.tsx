/**
 * Project Not Found Page
 * 
 * Displayed when a requested project doesn't exist.
 */

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ProjectNotFound() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="text-center max-w-lg">
          <h1 className="text-4xl font-bold text-[var(--primary)] mb-4">Project Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            We couldn't find the crypto project you're looking for.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-[var(--primary)] text-white px-6 py-3 rounded font-semibold hover:bg-opacity-90 transition-colors"
          >
            Browse All Projects
          </Link>
        </div>
      </div>
      
      <Footer minimal />
    </main>
  );
} 