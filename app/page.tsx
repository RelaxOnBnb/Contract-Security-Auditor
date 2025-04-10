"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Navigation from '@/components/Navigation';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    vulnerabilities: false,
    faq: false
  });

  const vulnerabilitiesRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === vulnerabilitiesRef.current) {
              setVisibleSections(prev => ({ ...prev, vulnerabilities: true }));
            } else if (entry.target === faqRef.current) {
              setVisibleSections(prev => ({ ...prev, faq: true }));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (vulnerabilitiesRef.current) {
      observer.observe(vulnerabilitiesRef.current);
    }
    if (faqRef.current) {
      observer.observe(faqRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const doughnutData = {
    labels: ['Centralized Ownership', 'Minting Exploit', 'Reentrancy'],
    datasets: [
      {
        label: 'Vulnerabilities',
        data: [45, 30, 25],
        backgroundColor: [
          'rgba(26, 117, 255, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(26, 117, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Centralized Ownership', 'Minting Exploit', 'Reentrancy'],
    datasets: [
      {
        label: 'Percentage of Vulnerabilities',
        data: [45, 30, 25],
        backgroundColor: [
          'rgba(26, 117, 255, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(26, 117, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const faqItems = [
    {
      question: "How does the scanner detect security risks?",
      answer: "Our scanner utilizes advanced AI algorithms and blockchain security frameworks to analyze smart contracts for vulnerabilities. It checks for common risks like reentrancy attacks, infinite minting, honeypot traps, and centralization risks. Additionally, it cross-verifies contract activity with real-time on-chain data to detect suspicious patterns."
    },
    {
      question: "What should I do if my contract is flagged as risky?",
      answer: "If your contract is flagged, review the detailed audit report provided by our tool. It will highlight potential vulnerabilities and suggest fixes. You should consider consulting a smart contract security expert to verify the findings and implement necessary security patches before deploying or interacting with the contract."
    },
    {
      question: "Does this tool support multi-chain audits?",
      answer: "Yes! Our scanner supports multiple blockchain networks, including Ethereum, Binance Smart Chain (BSC), Polygon, and more. It automatically detects the blockchain of the provided contract address and fetches relevant audit data for that specific network."
    },
    {
      question: "How accurate are the audit results?",
      answer: "Our audit results have a high accuracy rate, with over 95% of vulnerabilities detected in tested contracts. However, we recommend using our tool as part of a comprehensive security strategy that includes manual code review and formal verification for critical contracts."
    }
  ];
  
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navigation />

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-primary-base">Smart Contract Auditing</span>
            {' '}
            <span className="text-gray-dark">Made Simple</span>
          </h2>
          <p className="text-xl md:text-2xl font-medium text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Comprehensive audit tools for DEX traders investing in memecoins. Identify vulnerabilities, assess risks, and make informed decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto animate-fade-in-up animation-delay-300">
          <div className="glass-card hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-primary-200 transform hover:-translate-y-1 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Smart Contract Scanner</h3>
            <p className="text-gray-700 mb-6">
              Upload your smart contract file or paste the code directly to get a detailed audit report.
            </p>
            <Link href="/scan-contract" className="btn-primary inline-block w-full text-center transition-all duration-300 hover:shadow-lg hover:bg-primary-700 transform hover:scale-[1.02]">
              Scan Contract
            </Link>
          </div>
          
          <div className="glass-card hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-primary-200 transform hover:-translate-y-1 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Contract Address Scanner</h3>
            <p className="text-gray-700 mb-6">
              Enter a contract address to analyze its security, tokenomics, and market data.
            </p>
            <Link href="/scan-address" className="btn-primary inline-block w-full text-center transition-all duration-300 hover:shadow-lg hover:bg-primary-700 transform hover:scale-[1.02]">
              Scan Address
            </Link>
          </div>
        </div>
        
        <div className="mt-32 text-center animate-fade-in-up animation-delay-600">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">Why Choose Our Audit Scanner?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card hover:shadow-lg transition-all duration-300 border border-white/20 hover:border-primary-200 p-6 rounded-lg">
              <div className="bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Comprehensive Analysis</h3>
              <p className="text-gray-700">
                Get detailed insights on contract vulnerabilities, security risks, and token details.
              </p>
            </div>
            <div className="glass-card hover:shadow-lg transition-all duration-300 border border-white/20 hover:border-primary-200 p-6 rounded-lg">
              <div className="bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">AI-Powered</h3>
              <p className="text-gray-700">
                Our AI algorithm identifies complex vulnerabilities that traditional scanners miss.
              </p>
            </div>
            <div className="glass-card hover:shadow-lg transition-all duration-300 border border-white/20 hover:border-primary-200 p-6 rounded-lg">
              <div className="bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Real-time Monitoring</h3>
              <p className="text-gray-700">
                Continuous monitoring of contracts to identify emerging threats post-audit.
              </p>
            </div>
          </div>
        </div>
        
        <div 
          ref={vulnerabilitiesRef}
          className={`mt-32 glass-card py-16 px-8 rounded-lg border border-white/20 shadow-lg w-full transform transition-all duration-1000 ${
            visibleSections.vulnerabilities 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Most Common Vulnerabilities in Smart Contracts</h2>
          
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <div className="h-64 md:h-80 flex justify-center items-center">
                {visibleSections.vulnerabilities && <Bar data={barData} />}
              </div>
            </div>
            
            <div className="w-full md:w-1/3 glass-card p-6 rounded-lg shadow-md border border-white/20 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Risk Distribution</h3>
              <div className="mb-6 h-48 flex justify-center items-center">
                {visibleSections.vulnerabilities && <Doughnut data={doughnutData} />}
              </div>
              <p className="text-gray-700 mb-6">
                Our analysis of over 10,000 smart contracts shows that these three vulnerabilities account for 75% of all security incidents.
              </p>
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded transition-all duration-300 w-full hover:shadow-lg transform hover:scale-[1.02]">
                View Full Report
              </button>
            </div>
          </div>
        </div>
        
        <div 
          ref={faqRef}
          className={`mt-32 w-full max-w-4xl mx-auto transform transition-all duration-1000 ${
            visibleSections.faq 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="glass-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <button
                  className="w-full px-6 py-5 text-left bg-transparent hover:bg-white/50 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={activeFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-semibold text-lg text-gray-800">{item.question}</span>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    activeFaq === index ? 'bg-primary-100 rotate-180' : 'bg-white/50'
                  }`}>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 ${
                        activeFaq === index ? 'text-primary-600' : 'text-gray-600'
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div 
                  id={`faq-answer-${index}`}
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    activeFaq === index ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-4 bg-white/30">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a 
              href="#" 
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors duration-300"
            >
              View all FAQs
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gradient-to-r from-primary-700/90 to-primary-600/90 backdrop-blur-sm text-white py-16 mt-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Investments?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-white/90">
            Start using our smart contract audit tools today and make informed decisions about your cryptocurrency investments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/scan-contract" 
              className="btn bg-white text-primary-700 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl px-8 py-3 rounded-md font-bold"
            >
              Start Scanning
            </Link>
            <Link 
              href="/about" 
              className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 transition-all duration-300 px-8 py-3 rounded-md font-bold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 