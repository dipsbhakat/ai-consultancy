'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Services', href: '#services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                AI Consultancy
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
