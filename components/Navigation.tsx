"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileScanOpen, setIsMobileScanOpen] = useState(false);

  return (
    <div className="w-full bg-primary-base backdrop-blur-sm text-white shadow-lg relative z-40">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
            Smart Contract Audit Scanner
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>

            {/* Desktop Scan Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsScanOpen(!isScanOpen)}
                onBlur={() => setTimeout(() => setIsScanOpen(false), 200)}
                className="flex items-center text-white/90 hover:text-white transition-colors duration-200"
              >
                <span>Scan</span>
                <svg
                  className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                    isScanOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Desktop Dropdown Menu */}
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-60 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl py-2 transition-all duration-200 ${
                  isScanOpen
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <Link
                  href="/scan-contract"
                  className="flex items-center px-4 py-3 text-gray-dark hover:bg-gray-light transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-primary-base"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Smart Contract Scanner
                </Link>
                <Link
                  href="/scan-address"
                  className="flex items-center px-4 py-3 text-gray-dark hover:bg-gray-light transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-primary-base"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  Contract Address Scanner
                </Link>
              </div>
            </div>

            <Link 
              href="/about" 
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col space-y-2">
            <Link 
              href="/" 
              className="px-4 py-2 text-white/90 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Scan Section */}
            <div className="relative">
              <button
                onClick={() => setIsMobileScanOpen(!isMobileScanOpen)}
                className="w-full px-4 py-2 text-white/90 hover:bg-primary-700 rounded-lg transition-colors duration-200 flex justify-between items-center"
              >
                <span>Scan</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isMobileScanOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Mobile Scan Submenu */}
              <div 
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isMobileScanOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <Link
                  href="/scan-contract"
                  className="flex items-center px-8 py-2 text-white/90 hover:bg-primary-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Smart Contract Scanner
                </Link>
                <Link
                  href="/scan-address"
                  className="flex items-center px-8 py-2 text-white/90 hover:bg-primary-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  Contract Address Scanner
                </Link>
              </div>
            </div>

            <Link 
              href="/about" 
              className="px-4 py-2 text-white/90 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}