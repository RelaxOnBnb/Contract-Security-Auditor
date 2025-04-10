"use client";

import { useState, useEffect } from 'react';
import ContractForm from '@/components/ContractForm';
import AuditResults from '@/components/AuditResults';
import Loading from '@/components/Loading';

export default function ScanContractPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [auditResults, setAuditResults] = useState<any>(null);
  
  // Simulate progress when loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress(prev => {
          // Slow down progress as it gets closer to 100%
          const increment = Math.max(1, 10 - Math.floor(prev / 10));
          const newProgress = prev + increment;
          
          // Cap progress at 95% - the final jump to 100% happens when data arrives
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);
    } else if (auditResults) {
      setScanProgress(100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, auditResults]);
  
  const handleSubmit = async (data: { code: string; type: string }) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to the backend for contract scanning
      // For demo purposes, we'll simulate a loading delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Mock data for demonstration
      setAuditResults({
        projectInfo: {
          name: "Sample Token",
          contractType: data.type,
          tags: ["ERC20", "Token", "DeFi"],
          language: "Solidity",
          auditDate: new Date().toISOString().split('T')[0],
          status: "completed",
        },
        summary: {
          codeQuality: "The contract follows good coding practices with proper commenting and structure.",
          systemOverview: "This is a standard ERC20 token contract with additional functionality for liquidity management.",
          privilegedRoles: [
            "Owner can mint new tokens",
            "Owner can pause trading",
            "Owner can exclude addresses from fees"
          ],
          keyRisks: [
            "Owner has significant control over the token",
            "Trading can be paused by the owner",
            "Max transaction limit may impact large traders"
          ]
        },
        riskScore: 45,
        vulnerabilities: [
          {
            id: "V001",
            name: "Centralized Control",
            description: "The contract owner has significant control over the token, including the ability to mint new tokens and pause trading.",
            severity: "medium",
            function: "mint(address, uint256)",
            line: 142,
            solution: "Consider implementing a multi-signature mechanism for sensitive owner functions or remove them completely."
          },
          {
            id: "V002",
            name: "Potential Reentrancy",
            description: "The withdraw function calls external contract without following the checks-effects-interactions pattern.",
            severity: "high",
            function: "withdraw(uint256)",
            line: 205,
            solution: "Implement the checks-effects-interactions pattern by updating state variables before making external calls."
          },
          {
            id: "V003",
            name: "Unchecked Return Value",
            description: "The transfer return value is not checked, which could lead to silent failures.",
            severity: "low",
            function: "transfer(address, uint256)",
            line: 173,
            solution: "Use SafeERC20 library or check the return value of the transfer function."
          }
        ]
      });
    } catch (error) {
      console.error("Error scanning contract:", error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleScanAnother = () => {
    // Add a smooth transition effect when resetting
    setScanProgress(0);
    setAuditResults(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-base via-secondary-base to-gray-light">
      <div className="container mx-auto px-4 py-12">
        {/* Animated Title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Smart Contract Scanner
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Upload or paste your smart contract code to analyze for vulnerabilities and security risks.
          </p>
        </div>
        
        {isLoading ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition-all duration-500 animate-pulse-glow">
            <Loading message="Analyzing smart contract code..." progress={scanProgress} />
          </div>
        ) : !auditResults ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl animate-fade-in">
            <ContractForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="transition-all duration-500 transform animate-fade-in">
            <AuditResults 
              projectInfo={auditResults.projectInfo}
              summary={auditResults.summary}
              riskScore={auditResults.riskScore}
              vulnerabilities={auditResults.vulnerabilities}
            />
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => {
                  setScanProgress(0);
                  setAuditResults(null);
                }}
                className="btn-secondary bg-white/90 hover:bg-white transition-all duration-300 transform hover:scale-105"
              >
                Scan Another Contract
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 