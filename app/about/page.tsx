"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState({
    project: false,
    me: false
  });

  const projectRef = useRef<HTMLDivElement>(null);
  const meRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === projectRef.current) {
            setIsVisible(prev => ({ ...prev, project: entry.isIntersecting }));
          } else if (entry.target === meRef.current) {
            setIsVisible(prev => ({ ...prev, me: entry.isIntersecting }));
          }
        });
      },
      { threshold: 0.2 }
    );

    if (projectRef.current) observer.observe(projectRef.current);
    if (meRef.current) observer.observe(meRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-base via-secondary-base to-gray-light">
      <div className="container mx-auto px-4 py-16">
        {/* About This Project Section */}
        <div 
          ref={projectRef}
          className={`transition-all duration-1000 transform ${
            isVisible.project ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-16 hover:bg-white/98 transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-6">
              About This Project
            </h2>
            <p className="text-gray-medium text-lg leading-relaxed mb-8">
              This application is built to empower DEX traders by providing real-time analysis, 
              security audits, and essential insights before making trades. The tool detects 
              security risks, contract vulnerabilities, and other key factors that influence 
              token safety. By integrating advanced indicators, traders can make informed 
              decisions, reducing risks and maximizing profits. The platform is designed to be 
              user-friendly, fast, and efficient, making on-chain analysis accessible for everyone.
            </p>
          </div>
        </div>

        {/* About Me Section */}
        <div 
          ref={meRef}
          className={`transition-all duration-1000 transform ${
            isVisible.me ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 hover:bg-white/98 transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-6">
              About Me
            </h2>
            <p className="text-gray-medium text-lg leading-relaxed mb-8">
              I am <span className="font-bold text-primary-base">RelaxOnBnb</span>, 
              a blockchain enthusiast and cybersecurity expert with a deep passion for trading, 
              smart contract auditing, and decentralized finance (DeFi). My goal is to develop 
              tools that help traders navigate the complex world of DEX trading by providing 
              data-driven insights and security analysis. With a background in cybersecurity, 
              AI, and video editing, I continuously explore ways to enhance technology for 
              traders and investors.
            </p>

            <h3 className="text-xl font-bold text-gray-dark mb-4">My Mission:</h3>
            <ul className="list-disc list-inside text-gray-medium space-y-3 mb-8">
              <li>To reduce risks for DEX traders by providing in-depth security audits.</li>
              <li>To create an intelligent trading assistant that analyzes key market indicators.</li>
              <li>To help traders make informed decisions by highlighting crucial token data before investments.</li>
            </ul>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link 
                href="https://x.com/RelaxOnBnb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-6 py-3 bg-primary-base text-white rounded-full hover:bg-secondary-base transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x mr-2" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                </svg>
                Follow on X
              </Link>
              <Link 
                href="https://github.com/RelaxOnBnb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-6 py-3 bg-gray-dark text-white rounded-full hover:bg-gray-medium transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github mr-2" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                </svg>
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 