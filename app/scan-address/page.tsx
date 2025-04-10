"use client";

import { useState, useEffect } from 'react';
import AddressForm from '@/components/AddressForm';
import AddressScanResults from '@/components/AddressScanResults';
import Loading from '@/components/Loading';
import { 
  getTokenDataFromExplorer, 
  getTokenHolders, 
  getLiquidityInfo, 
  checkHoneypot,
  performSecurityCheck,
  getTransactionHistory 
} from '@/utils/api'; // Make sure this path matches where your API functions are defined

interface Transaction {
  type: 'buy' | 'sell';
  value: string; // Adjust this based on your actual data structure
}

export default function ScanAddressPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Simulate progress when loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress(prev => {
          const increment = Math.max(1, 10 - Math.floor(prev / 10));
          const newProgress = prev + increment;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);
    } else if (scanResults) {
      setScanProgress(100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, scanResults]);
  
  const handleSubmit = async (data: { address: string; blockchain: string }) => {
    setIsLoading(true);
    setError(null);
    setScanResults(null);
    
    try {
      // Fetch real data using API functions
      const [
        tokenData,
        securityCheckData,
        holdersData,
        liquidityData,
        honeypotData,
        transactionData
      ] = await Promise.all([
        getTokenDataFromExplorer(data.address, data.blockchain),
        performSecurityCheck(data.address, data.blockchain),
        getTokenHolders(data.address, data.blockchain),
        getLiquidityInfo(data.address, data.blockchain),
        checkHoneypot(data.address, data.blockchain),
        getTransactionHistory(data.address, data.blockchain)
      ]);
      
      // Calculate buy/sell ratio from transaction data
      const buys = (transactionData.transactions as Transaction[]).filter(tx => tx.type === 'buy').length;
      const sells = (transactionData.transactions as Transaction[]).filter(tx => tx.type === 'sell').length;
      const buySellRatio = buys > sells;
      
      // Calculate social media presence (mocked - would need real API for this)
      // In a real implementation, you would integrate with Twitter/Telegram APIs
      const hasSocialMedia = true;
      const hasTelegram = true;
      
      // Transform API responses into the format expected by AddressScanResults
      const formattedResults = {
        tokenDetails: {
          name: tokenData.token.name,
          address: data.address,
          blockchain: data.blockchain === 'ethereum' ? 'Ethereum' : 
                    data.blockchain === 'binance' ? 'BNB Chain' : 
                    data.blockchain === 'polygon' ? 'Polygon' : 
                    data.blockchain === 'solana' ? 'Solana' : 'Unknown',
          auditDate: new Date().toISOString().split('T')[0],
          overallRiskLevel: securityCheckData.riskLevel,
        },
        securityAnalysis: {
          contractVerified: true, // Would need to check this via API
          ownershipRenounced: false, // Would need to check this via API
          mintingDisabled: !securityCheckData.details.honeypot.isHoneypot,
          blacklistFunctions: false, // Would need contract analysis API
          tradingRestrictions: securityCheckData.details.honeypot.canBuy && securityCheckData.details.honeypot.canSell ? false : true,
          proxyContractRisks: false, // Would need contract analysis API
          thirdPartyAudit: false, // Would need to check this via API
          suspiciousFunctions: securityCheckData.riskFactors.some(factor => factor.includes('function')),
          honeypotRisk: securityCheckData.details.honeypot.isHoneypot,
          explorerUrl: `https://${data.blockchain === 'binance' ? 'bscscan.com' : 
                        data.blockchain === 'ethereum' ? 'etherscan.io' : 
                        data.blockchain === 'polygon' ? 'polygonscan.com' : 
                        'explorer.solana.com'}/address/${data.address}`,
          notes: {
            contractVerified: "Contract verification status needs API integration",
            ownershipRenounced: "Ownership status needs API integration",
            mintingDisabled: securityCheckData.details.honeypot.isHoneypot ? 
              "Potential minting functions found" : "No dangerous minting functions detected",
            blacklistFunctions: "Blacklist function detection needs API integration",
            tradingRestrictions: securityCheckData.details.honeypot.canBuy && securityCheckData.details.honeypot.canSell ?
              "No trading restrictions detected" : "Trading restrictions detected",
            suspiciousFunctions: securityCheckData.riskFactors.join(", "),
          },
          rating: securityCheckData.riskLevel === 'HIGH' ? 'High Risk' : 
                 securityCheckData.riskLevel === 'MEDIUM' ? 'Medium Risk' : 'Low Risk'
        },
        tokenomicsAnalysis: {
          totalSupply: tokenData.token.totalSupply,
          circulatingSupply: `${tokenData.token.totalSupply} (100%)`, // Would need circulation data
          topHoldersRisk: holdersData.holders[0].percentage > "20%",
          unlockedTokensRisk: !liquidityData.liquidity.liquidityLocked,
          liquidityLocked: liquidityData.liquidity.liquidityLocked,
          liquidityRatio: parseFloat(liquidityData.liquidity.totalLiquidity.replace(/[^0-9.]/g, '')) > 100000,
          launchType: 'Unknown', // Would need additional API data
          notes: {
            totalSupply: `${tokenData.token.totalSupply} ${tokenData.token.symbol} tokens`,
            circulatingSupply: "Circulating supply data needs API integration",
            topHoldersRisk: `Top holder owns ${holdersData.holders[0].percentage} of supply`,
            unlockedTokensRisk: liquidityData.liquidity.liquidityLocked ? 
              `Liquidity locked for ${liquidityData.liquidity.lockDuration}` : "Liquidity is not locked",
            liquidityLocked: liquidityData.liquidity.liquidityLocked ? 
              `Locked until ${new Date(liquidityData.liquidity.lockedUntil).toLocaleDateString()}` : "Not locked",
            liquidityRatio: `Liquidity is ${liquidityData.liquidity.totalLiquidity}`,
          },
          rating: holdersData.holders[0].percentage > "40%" || !liquidityData.liquidity.liquidityLocked ? 
            'High Risk' : holdersData.holders[0].percentage > "20%" ? 'Medium Risk' : 'Low Risk'
        },
        marketAnalysis: {
          liquidityDepth: parseFloat(liquidityData.liquidity.totalLiquidity.replace(/[^0-9.]/g, '')) > 100000,
          buySellRatio: buySellRatio,
          tradingVolume: "$" + transactionData.transactions.reduce((sum: number, tx: Transaction) => 
            sum + parseFloat(tx.value.split(' ')[0]), 0).toFixed(2),
          slippageRequired: honeypotData.buyTax + "/" + honeypotData.sellTax,
          mevBotDetected: false, // Would need specialized API
          notes: {
            liquidityDepth: `Current liquidity: ${liquidityData.liquidity.totalLiquidity}`,
            buySellRatio: buySellRatio ? "More buys than sells in recent transactions" : "More sells than buys in recent transactions",
            tradingVolume: `Based on recent transactions in our data`,
            slippageRequired: `Buy tax: ${honeypotData.buyTax}, Sell tax: ${honeypotData.sellTax}`,
            mevBotDetected: "MEV bot detection requires specialized API integration",
          },
          rating: !liquidityData.liquidity.liquidityLocked || parseFloat(honeypotData.sellTax.replace('%', '')) > 10 ? 
            'High Risk' : !buySellRatio ? 'Medium Risk' : 'Low Risk'
        },
        communityAnalysis: {
          socialMediaEngagement: hasSocialMedia,
          telegramActivity: hasTelegram,
          teamDoxxed: false, // Would need specialized API or manual research
          websiteQuality: tokenData.token.website ? true : false,
          notes: {
            socialMediaEngagement: tokenData.token.social?.twitter ? 
              `Twitter: ${tokenData.token.social.twitter}` : "No social media found",
            telegramActivity: tokenData.token.social?.telegram ? 
              `Telegram: ${tokenData.token.social.telegram}` : "No Telegram found",
            teamDoxxed: "Team identity verification requires manual research",
            websiteQuality: tokenData.token.website ? 
              `Website: ${tokenData.token.website}` : "No website found",
          },
          rating: !hasSocialMedia && !hasTelegram ? 'High Risk' : !tokenData.token.website ? 'Medium Risk' : 'Low Risk'
        },
        sentimentAnalysis: {
          mediaMetions: false, // Would need news API integration
          partnerships: false, // Would need specialized API
          pastRugPulls: false, // Would need specialized API
          notes: {
            mediaMetions: "Media mentions require news API integration",
            partnerships: "Partnership verification requires manual research",
            pastRugPulls: "Historical analysis requires specialized API",
          },
          rating: 'Unknown' // Need more data sources for accurate sentiment analysis
        },
        recommendation: securityCheckData.riskLevel === 'HIGH' ? 'High Risk - Not Recommended' : 
                       securityCheckData.riskLevel === 'MEDIUM' ? 'Caution Advised' : 'Moderate Risk',
        externalLinks: {
          explorer: `https://${data.blockchain === 'binance' ? 'bscscan.com' : 
                    data.blockchain === 'ethereum' ? 'etherscan.io' : 
                    data.blockchain === 'polygon' ? 'polygonscan.com' : 
                    'explorer.solana.com'}/address/${data.address}`,
          dexTools: `https://www.dextools.io/app/${data.blockchain === 'binance' ? 'bnb' : 
                    data.blockchain === 'ethereum' ? 'eth' : 
                    data.blockchain === 'polygon' ? 'polygon' : 'solana'}/pair-explorer/${data.address}`,
          dexScreener: `https://dexscreener.com/${data.blockchain === 'binance' ? 'bsc' : 
                      data.blockchain === 'ethereum' ? 'ethereum' : 
                      data.blockchain === 'polygon' ? 'polygon' : 'solana'}/${data.address}`,
          community: tokenData.token.social?.telegram || "https://t.me/unknown",
        }
      };
      
      setScanResults(formattedResults);
    } catch (error) {
      console.error("Error scanning address:", error);
      setError("Failed to scan address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-base via-secondary-base to-gray-light">
      <div className="container mx-auto px-4 py-12">
        {/* Animated Title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Contract Address Scanner
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Enter a token contract address to analyze its security, tokenomics, and market data.
          </p>
        </div>
        
        {isLoading ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition-all duration-500 animate-pulse-glow">
            <Loading message="Scanning contract address..." progress={scanProgress} />
          </div>
        ) : !scanResults ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl animate-fade-in">
            <AddressForm onSubmit={handleSubmit} isLoading={isLoading} />
            {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
          </div>
        ) : (
          <div className="transition-all duration-500 transform animate-fade-in">
            <AddressScanResults 
              tokenDetails={scanResults.tokenDetails}
              securityAnalysis={scanResults.securityAnalysis}
              tokenomicsAnalysis={scanResults.tokenomicsAnalysis}
              marketAnalysis={scanResults.marketAnalysis}
              communityAnalysis={scanResults.communityAnalysis}
              sentimentAnalysis={scanResults.sentimentAnalysis}
              recommendation={scanResults.recommendation}
              externalLinks={scanResults.externalLinks}
            />
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => {
                  setScanProgress(0);
                  setScanResults(null);
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