import Link from 'next/link';
import { useState } from 'react';

interface ScannerHeaderProps {
  activeTab: 'address' | 'contract';
  onTabChange: (tab: 'address' | 'contract') => void;
}

export default function ScannerHeader({ activeTab, onTabChange }: ScannerHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="flex-shrink-0 flex items-center cursor-pointer">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 mr-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-xl">Audit Scanner</span>
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link href="/scanner">
              <span className="px-3 py-2 rounded-md text-sm font-medium bg-primary-800 text-white cursor-pointer">Scanner</span>
            </Link>
            <Link href="/reports">
              <span className="px-3 py-2 rounded-md text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-600 cursor-pointer">Reports</span>
            </Link>
            <Link href="/documentation">
              <span className="px-3 py-2 rounded-md text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-600 cursor-pointer">Documentation</span>
            </Link>
            <Link href="/pricing">
              <span className="px-3 py-2 rounded-md text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-600 cursor-pointer">Pricing</span>
            </Link>
          </nav>
          
          <div className="flex items-center">
            <div className="hidden md:block">
              <button className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Connect Wallet
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary-300 hover:text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/scanner">
            <span className="block px-3 py-2 rounded-md text-base font-medium bg-primary-800 text-white cursor-pointer">Scanner</span>
          </Link>
          <Link href="/reports">
            <span className="block px-3 py-2 rounded-md text-base font-medium text-primary-300 hover:text-white hover:bg-primary-600 cursor-pointer">Reports</span>
          </Link>
          <Link href="/documentation">
            <span className="block px-3 py-2 rounded-md text-base font-medium text-primary-300 hover:text-white hover:bg-primary-600 cursor-pointer">Documentation</span>
          </Link>
          <Link href="/pricing">
            <span className="block px-3 py-2 rounded-md text-base font-medium text-primary-300 hover:text-white hover:bg-primary-600 cursor-pointer">Pricing</span>
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-primary-600">
          <div className="px-2">
            <button className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
      
      {/* Scanner Tab Navigation */}
      <div className="border-t border-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            <button
              onClick={() => onTabChange('address')}
              className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'address'
                  ? 'border-b-2 border-white text-white'
                  : 'text-primary-300 hover:text-white'
              }`}
            >
              Scan Contract Address
            </button>
            <button
              onClick={() => onTabChange('contract')}
              className={`ml-8 px-4 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'contract'
                  ? 'border-b-2 border-white text-white'
                  : 'text-primary-300 hover:text-white'
              }`}
            >
              Scan Contract Code
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 