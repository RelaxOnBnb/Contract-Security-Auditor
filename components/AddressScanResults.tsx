"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TokenDetails {
  name: string;
  address: string;
  blockchain: string;
  auditDate: string;
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface SecurityAnalysis {
  contractVerified: boolean;
  ownershipRenounced: boolean;
  mintingDisabled: boolean;
  blacklistFunctions: boolean;
  tradingRestrictions: boolean;
  proxyContractRisks: boolean;
  thirdPartyAudit: boolean;
  suspiciousFunctions: boolean;
  honeypotRisk: boolean;
  explorerUrl?: string;
  notes: {
    contractVerified?: string;
    ownershipRenounced?: string;
    mintingDisabled?: string;
    blacklistFunctions?: string;
    tradingRestrictions?: string;
    proxyContractRisks?: string;
    thirdPartyAudit?: string;
    suspiciousFunctions?: string;
    honeypotRisk?: string;
  };
  rating: 'Low Risk' | 'Medium Risk' | 'High Risk';
}

interface TokenomicsAnalysis {
  totalSupply: string;
  circulatingSupply: string;
  topHoldersRisk: boolean;
  unlockedTokensRisk: boolean;
  liquidityLocked: boolean;
  liquidityRatio: boolean;
  launchType: 'Presale' | 'Fair Launch';
  notes: {
    totalSupply?: string;
    circulatingSupply?: string;
    topHoldersRisk?: string;
    unlockedTokensRisk?: string;
    liquidityLocked?: string;
    liquidityRatio?: string;
    launchType?: string;
  };
  rating: 'Low Risk' | 'Medium Risk' | 'High Risk';
}

interface MarketAnalysis {
  liquidityDepth: boolean;
  buySellRatio: boolean;
  tradingVolume: string;
  slippageRequired: string;
  mevBotDetected: boolean;
  notes: {
    liquidityDepth?: string;
    buySellRatio?: string;
    tradingVolume?: string;
    slippageRequired?: string;
    mevBotDetected?: string;
  };
  rating: 'Low Risk' | 'Medium Risk' | 'High Risk';
}

interface CommunityAnalysis {
  socialMediaEngagement: boolean;
  telegramActivity: boolean;
  teamDoxxed: boolean;
  websiteQuality: boolean;
  notes: {
    socialMediaEngagement?: string;
    telegramActivity?: string;
    teamDoxxed?: string;
    websiteQuality?: string;
  };
  rating: 'Low Risk' | 'Medium Risk' | 'High Risk';
}

interface SentimentAnalysis {
  mediaMetions: boolean;
  partnerships: boolean;
  pastRugPulls: boolean;
  notes: {
    mediaMetions?: string;
    partnerships?: string;
    pastRugPulls?: string;
  };
  rating: 'Low Risk' | 'Medium Risk' | 'High Risk';
}

interface AddressScanResultsProps {
  tokenDetails: TokenDetails;
  securityAnalysis: SecurityAnalysis;
  tokenomicsAnalysis: TokenomicsAnalysis;
  marketAnalysis: MarketAnalysis;
  communityAnalysis: CommunityAnalysis;
  sentimentAnalysis: SentimentAnalysis;
  recommendation: 'Safe to Buy' | 'Caution Advised' | 'High Risk - Avoid';
  externalLinks: {
    explorer?: string;
    dexTools?: string;
    dexScreener?: string;
    community?: string;
  };
}

export default function AddressScanResults({
  tokenDetails,
  securityAnalysis,
  tokenomicsAnalysis,
  marketAnalysis,
  communityAnalysis,
  sentimentAnalysis,
  recommendation,
  externalLinks,
}: AddressScanResultsProps) {
  const [activeTab, setActiveTab] = useState('summary');
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const { top } = navRef.current.getBoundingClientRect();
        setIsSticky(top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
      case 'high risk':
        return 'bg-red-500';
      case 'medium':
      case 'medium risk':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const getRiskBorderColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
      case 'high risk':
        return 'border-red-500';
      case 'medium':
      case 'medium risk':
        return 'border-yellow-500';
      default:
        return 'border-green-500';
    }
  };

  const sections = [
    { id: 'summary', label: 'Summary' },
    { id: 'security', label: 'Security' },
    { id: 'tokenomics', label: 'Tokenomics' },
    { id: 'market', label: 'Market' },
    { id: 'community', label: 'Community' }
  ];
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Token Overview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 mb-8 border border-white/20"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{tokenDetails.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
            {tokenDetails.blockchain}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                Audited: {tokenDetails.auditDate}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-mono break-all">{tokenDetails.address}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getRiskColor(tokenDetails.overallRiskLevel)}`}>
              {tokenDetails.overallRiskLevel} Risk Level
          </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div 
        ref={navRef}
        className={`transition-all duration-300 ${
          isSticky 
            ? 'sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-lg' 
            : ''
        }`}
      >
        <div className="flex overflow-x-auto hide-scrollbar space-x-2 p-2 rounded-lg">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${
                activeTab === section.id
                  ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content Sections */}
      <div ref={sectionsRef} className="mt-8 space-y-8">
        {activeTab === 'summary' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Security Summary Card */}
            <div className={`glass-card rounded-2xl p-6 border-l-4 ${getRiskBorderColor(securityAnalysis.rating)} hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Security Analysis</h3>
              <div className="space-y-3">
                {Object.entries(securityAnalysis).map(([key, value]) => {
                  if (key === 'notes' || key === 'rating' || key === 'explorerUrl') return null;
                  return (
                    <div key={key} className="flex items-center">
                      {value ? (
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className="text-gray-700">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    </div>
                  );
                })}
              </div>
              </div>
              
            {/* Tokenomics Summary Card */}
            <div className={`glass-card rounded-2xl p-6 border-l-4 ${getRiskBorderColor(tokenomicsAnalysis.rating)} hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Tokenomics Overview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Supply</p>
                  <p className="text-lg font-semibold">{tokenomicsAnalysis.totalSupply}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Circulating Supply</p>
                  <p className="text-lg font-semibold">{tokenomicsAnalysis.circulatingSupply}</p>
                  </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Liquidity Locked</span>
                  {tokenomicsAnalysis.liquidityLocked ? (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Yes</span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">No</span>
                  )}
                </div>
              </div>
                </div>
                
            {/* Market Analysis Card */}
            <div className={`glass-card rounded-2xl p-6 border-l-4 ${getRiskBorderColor(marketAnalysis.rating)} hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Market Analysis</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Trading Volume (24h)</p>
                  <p className="text-lg font-semibold">{marketAnalysis.tradingVolume}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Slippage Required</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: marketAnalysis.slippageRequired }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">MEV Bot Detection</span>
                  {marketAnalysis.mevBotDetected ? (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">Detected</span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Not Detected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Community Analysis Card */}
            <div className={`glass-card rounded-2xl p-6 border-l-4 ${getRiskBorderColor(communityAnalysis.rating)} hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Community Analysis</h3>
              <div className="space-y-3">
                {Object.entries(communityAnalysis).map(([key, value]) => {
                  if (key === 'notes' || key === 'rating') return null;
                  return (
                    <div key={key} className="flex items-center">
                      {value ? (
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className="text-gray-700">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    </div>
                  );
                })}
            </div>
          </div>
          </motion.div>
        )}
        
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Security Analysis</h3>
                <span className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getRiskColor(securityAnalysis.rating)}`}>
                  {securityAnalysis.rating}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contract Security */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Contract Security</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Contract Verified</span>
                      {securityAnalysis.contractVerified ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Verified</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">Unverified</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Ownership Status</span>
                      {securityAnalysis.ownershipRenounced ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Renounced</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">Not Renounced</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Minting Function</span>
                      {securityAnalysis.mintingDisabled ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Disabled</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">Enabled</span>
                      )}
                    </div>
                  </div>
            </div>
            
                {/* Risk Factors */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Risk Factors</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Blacklist Functions</span>
                      {securityAnalysis.blacklistFunctions ? (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">Present</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">None</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Trading Restrictions</span>
                      {securityAnalysis.tradingRestrictions ? (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">Present</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">None</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Honeypot Risk</span>
                      {securityAnalysis.honeypotRisk ? (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">Detected</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Not Detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notes */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Security Notes</h4>
                <div className="space-y-2">
                  {Object.entries(securityAnalysis.notes).map(([key, value]) => (
                    <div key={key} className="flex items-start space-x-2 text-blue-700">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
          </div>
          </motion.div>
        )}
        
        {activeTab === 'tokenomics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Tokenomics Analysis</h3>
                <span className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getRiskColor(tokenomicsAnalysis.rating)}`}>
                  {tokenomicsAnalysis.rating}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Supply Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Supply Information</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total Supply</div>
                      <div className="text-xl font-semibold text-gray-800">{tokenomicsAnalysis.totalSupply}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Circulating Supply</div>
                      <div className="text-xl font-semibold text-gray-800">{tokenomicsAnalysis.circulatingSupply}</div>
                    </div>
                  </div>
                </div>

                {/* Liquidity Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Liquidity Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Liquidity Locked</span>
                      {tokenomicsAnalysis.liquidityLocked ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Yes</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">No</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Launch Type</span>
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">{tokenomicsAnalysis.launchType}</span>
                    </div>
                  </div>
                </div>
            </div>
            
              {/* Risk Indicators */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${tokenomicsAnalysis.topHoldersRisk ? 'bg-red-50' : 'bg-green-50'}`}>
                  <h5 className="font-medium mb-2">Top Holders Risk</h5>
                  <p className="text-sm">{tokenomicsAnalysis.notes.topHoldersRisk}</p>
                </div>
                <div className={`p-4 rounded-lg ${tokenomicsAnalysis.unlockedTokensRisk ? 'bg-red-50' : 'bg-green-50'}`}>
                  <h5 className="font-medium mb-2">Unlocked Tokens Risk</h5>
                  <p className="text-sm">{tokenomicsAnalysis.notes.unlockedTokensRisk}</p>
                </div>
                <div className={`p-4 rounded-lg ${!tokenomicsAnalysis.liquidityRatio ? 'bg-red-50' : 'bg-green-50'}`}>
                  <h5 className="font-medium mb-2">Liquidity Ratio</h5>
                  <p className="text-sm">{tokenomicsAnalysis.notes.liquidityRatio}</p>
                </div>
              </div>
          </div>
          </motion.div>
        )}
        
        {activeTab === 'market' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Market Analysis</h3>
                <span className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getRiskColor(marketAnalysis.rating)}`}>
                  {marketAnalysis.rating}
                </span>
            </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trading Metrics */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Trading Metrics</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">24h Trading Volume</div>
                      <div className="text-xl font-semibold text-gray-800">{marketAnalysis.tradingVolume}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Required Slippage</div>
                      <div className="text-xl font-semibold text-gray-800">{marketAnalysis.slippageRequired}</div>
                    </div>
                  </div>
                </div>

                {/* Market Health */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Market Health</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Liquidity Depth</span>
                      {marketAnalysis.liquidityDepth ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Good</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">Low</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Buy/Sell Ratio</span>
                      {marketAnalysis.buySellRatio ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Healthy</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">Imbalanced</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Notes */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Market Analysis Notes</h4>
                <div className="space-y-2">
                  {Object.entries(marketAnalysis.notes).map(([key, value]) => (
                    <div key={key} className="flex items-start space-x-2 text-blue-700">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
          </div>
          </motion.div>
        )}
        
        {activeTab === 'community' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Community Analysis</h3>
                <span className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getRiskColor(communityAnalysis.rating)}`}>
                  {communityAnalysis.rating}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Community Metrics */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Community Engagement</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Social Media Activity</span>
                      {communityAnalysis.socialMediaEngagement ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Active</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">Limited</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Telegram/Discord</span>
                      {communityAnalysis.telegramActivity ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Active</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">Limited</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Project Transparency */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Project Transparency</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Team Identity</span>
                      {communityAnalysis.teamDoxxed ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Doxxed</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">Anonymous</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Website Quality</span>
                      {communityAnalysis.websiteQuality ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Professional</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">Basic</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Community Notes */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Community Notes</h4>
                <div className="space-y-2">
                  {Object.entries(communityAnalysis.notes).map(([key, value]) => (
                    <div key={key} className="flex items-start space-x-2 text-blue-700">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
            </div>
            
      {/* External Links */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 glass-card rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold mb-4 text-gray-800">External Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(externalLinks).map(([key, value]) => (
            <a
              key={key}
              href={value}
                  target="_blank"
                  rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 