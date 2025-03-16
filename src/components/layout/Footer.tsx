/**
 * Footer Component
 * 
 * Site-wide footer with links and copyright information.
 */

import Image from 'next/image';
import Link from 'next/link';

/**
 * Footer section categories and links
 */
const FOOTER_LINKS = {
  explore: [
    { name: 'Exchanges', href: '/exchanges' },
    { name: 'Projects', href: '/projects' },
    { name: 'VC', href: '/vc' },
    { name: 'Agency', href: '/agency' },
  ],
  categories: [
    { name: 'DeFi', href: '/defi' },
    { name: 'NFT', href: '/nft' },
    { name: 'GameFi', href: '/gamefi' },
    { name: 'Meme Coins', href: '/meme' },
  ],
  about: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

/**
 * Footer link section component
 */
function FooterSection({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-gray-400 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-white">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Main footer component
 */
export function Footer({ minimal = false }: { minimal?: boolean }) {
  const currentYear = new Date().getFullYear();
  
  if (minimal) {
    return (
      <footer className="bg-[var(--secondary)] text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Cryptomato. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }
  
  return (
    <footer className="bg-[var(--secondary)] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-white font-bold text-xl flex items-center gap-2">
              <Image 
                src="/cryptomato-logo.svg" 
                alt="Cryptomato"
                width={30} 
                height={30}
                className="object-contain"
              />
              <span>Cryptomato</span>
            </Link>
            <p className="text-gray-400 mt-2 text-sm">
              The trusted source for crypto project reviews
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterSection title="Explore" links={FOOTER_LINKS.explore} />
            <FooterSection title="Categories" links={FOOTER_LINKS.categories} />
            <FooterSection title="About" links={FOOTER_LINKS.about} />
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Cryptomato. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 