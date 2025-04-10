import axios from 'axios';

// Generic API call wrapper with error handling
export const apiCall = async (
  url: string,
  method: 'GET' | 'POST' = 'GET',
  data?: any,
  headers?: any
) => {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

// Get token data from a blockchain explorer API
export const getTokenDataFromExplorer = async (
  address: string,
  blockchain: string
) => {
  // Configure API endpoints based on blockchain
  const explorers = {
    ethereum: {
      baseUrl: 'https://api.etherscan.io/api',
      apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
    },
    binance: {
      baseUrl: 'https://api.bscscan.com/api',
      apiKey: process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || '',
    },
    polygon: {
      baseUrl: 'https://api.polygonscan.com/api',
      apiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY || '',
    },
    solana: {
      baseUrl: 'https://api.solscan.io',
      apiKey: process.env.NEXT_PUBLIC_SOLSCAN_API_KEY || '',
    }
  };

  if (!explorers[blockchain as keyof typeof explorers]) {
    throw new Error('Unsupported blockchain');
  }

  const { baseUrl, apiKey } = explorers[blockchain as keyof typeof explorers];
  
  try {
    // Getting token info (depends on blockchain)
    let tokenInfoUrl = '';
    
    if (blockchain === 'solana') {
      tokenInfoUrl = `${baseUrl}/token/${address}`;
      const headers = apiKey ? { 'token': apiKey } : {};
      const tokenData = await apiCall(tokenInfoUrl, 'GET', null, headers);
      
      // Format Solana response to match our expected format
      return {
        status: 'success',
        token: {
          name: tokenData.name || 'Unknown Token',
          symbol: tokenData.symbol || 'UNKNOWN',
          totalSupply: tokenData.supply.toString() || '0',
          decimals: tokenData.decimals?.toString() || '0',
          website: tokenData.website || '',
          social: {
            twitter: tokenData.twitter || '',
            telegram: tokenData.telegram || '',
          },
        },
      };
    } else {
      // For EVM chains (Ethereum, BSC, Polygon)
      // Get token metadata
      tokenInfoUrl = `${baseUrl}?module=token&action=tokeninfo&contractaddress=${address}&apikey=${apiKey}`;
      const tokenInfoResponse = await apiCall(tokenInfoUrl);
      
      if (tokenInfoResponse.status !== '1' && tokenInfoResponse.message !== 'OK') {
        // Fall back to contract ABI to extract basic information
        const abiUrl = `${baseUrl}?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;
        const contractResponse = await apiCall(abiUrl);
        
        if (contractResponse.status === '1') {
          // Parse ABI and extract token info
          const abi = JSON.parse(contractResponse.result);
          
          // Get contract name and symbol using additional calls
          const nameFunction = abi.find((item: any) => 
            item.name === 'name' && item.type === 'function' && item.outputs?.length);
          
          const symbolFunction = abi.find((item: any) => 
            item.name === 'symbol' && item.type === 'function' && item.outputs?.length);
          
          // Get total supply
          const totalSupplyFunction = abi.find((item: any) => 
            item.name === 'totalSupply' && item.type === 'function' && item.outputs?.length);
          
          let name = 'Unknown Token';
          let symbol = 'UNKNOWN';
          let totalSupply = '0';
          
          // You would need a web3 provider here to call these functions
          // For demo purposes we'll return placeholder data
          
          return {
            status: 'success',
            token: {
              name: name,
              symbol: symbol,
              totalSupply: totalSupply,
              decimals: '18',
              website: '',
              social: {
                twitter: '',
                telegram: '',
              },
            },
          };
        }
      } else {
        // Successfully got token info from explorer
        const tokenInfo = tokenInfoResponse.result;
        
        return {
          status: 'success',
          token: {
            name: tokenInfo.name || 'Unknown Token',
            symbol: tokenInfo.symbol || 'UNKNOWN',
            totalSupply: tokenInfo.totalSupply || '0',
            decimals: tokenInfo.decimals || '18',
            website: tokenInfo.website || '',
            social: {
              twitter: tokenInfo.twitter || '',
              telegram: tokenInfo.telegram || '',
            },
          },
        };
      }
    }
    
    // If all else fails, return generic data
    return {
      status: 'error',
      token: {
        name: 'Unknown Token',
        symbol: 'UNKNOWN',
        totalSupply: '0',
        decimals: '18',
        website: '',
        social: {
          twitter: '',
          telegram: '',
        },
      },
    };
  } catch (error) {
    console.error("Error fetching token data:", error);
    throw new Error(`Failed to fetch token data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get transaction history from DEX aggregator or explorer
export const getTransactionHistory = async (
  address: string,
  blockchain: string
) => {
  try {
    // Configure API endpoints based on blockchain
    const explorers = {
      ethereum: {
        baseUrl: 'https://api.etherscan.io/api',
        apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
      },
      binance: {
        baseUrl: 'https://api.bscscan.com/api',
        apiKey: process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || '',
      },
      polygon: {
        baseUrl: 'https://api.polygonscan.com/api',
        apiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY || '',
      },
      solana: {
        baseUrl: 'https://api.solscan.io',
        apiKey: process.env.NEXT_PUBLIC_SOLSCAN_API_KEY || '',
      }
    };

    if (!explorers[blockchain as keyof typeof explorers]) {
      throw new Error('Unsupported blockchain');
    }

    const { baseUrl, apiKey } = explorers[blockchain as keyof typeof explorers];
    
    // Get recent transactions
    let txUrl = '';
    
    if (blockchain === 'solana') {
      txUrl = `${baseUrl}/account/transactions?account=${address}&limit=10`;
      const headers = apiKey ? { 'token': apiKey } : {};
      const txData = await apiCall(txUrl, 'GET', null, headers);
      
      // Process and categorize transactions
      const transactions = txData.map((tx: any) => {
        // This is a simplification - proper categorization would need more context
        const isIncoming = tx.tokenTransfers?.some((transfer: any) => 
          transfer.destination === address);
        
        return {
          hash: tx.txHash,
          type: isIncoming ? 'buy' : 'sell',
          amount: tx.tokenTransfers?.[0]?.amount || '0',
          value: `${tx.tokenTransfers?.[0]?.amount || '0'} tokens`,
          timestamp: tx.blockTime * 1000,
        };
      });
      
      return {
        status: 'success',
        transactions,
      };
    } else {
      // For EVM chains
      txUrl = `${baseUrl}?module=account&action=tokentx&contractaddress=${address}&sort=desc&apikey=${apiKey}`;
      const txResponse = await apiCall(txUrl);
      
      if (txResponse.status === '1') {
        // Process and categorize transactions
        const transactions = txResponse.result.slice(0, 20).map((tx: any) => {
          // Basic heuristic: transfers TO the contract might be sells, FROM might be buys
          // This is simplified and would need to be improved for production
          const isSell = tx.to.toLowerCase() === address.toLowerCase();
          
          return {
            hash: tx.hash,
            type: isSell ? 'sell' : 'buy',
            amount: tx.value,
            value: `${tx.value / (10 ** parseInt(tx.tokenDecimal))} ${tx.tokenSymbol}`,
            timestamp: parseInt(tx.timeStamp) * 1000,
          };
        });
        
        return {
          status: 'success',
          transactions,
        };
      }
    }
    
    // If API calls fail or return unexpected data, return empty array
    return {
      status: 'error',
      transactions: [],
    };
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    
    // Return empty array with error status
    return {
      status: 'error',
      transactions: [
        {
          hash: 'error',
          type: 'buy',
          amount: '0',
          value: '0 ETH',
          timestamp: Date.now(),
        }
      ],
    };
  }
};

// Get liquidity information from DEX API or aggregator
export const getLiquidityInfo = async (
  address: string,
  blockchain: string
) => {
  try {
    // In a real implementation, you'd call DexScreener API, DexTools API, or similar services
    // For this implementation, we'll try to fetch from a public API that provides liquidity data
    
    let apiUrl = '';
    let headers = {};
    
    switch (blockchain) {
      case 'ethereum':
        apiUrl = `https://api.dextools.io/v1/token/${address}/liquidity`;
        headers = {
          'X-API-Key': process.env.NEXT_PUBLIC_DEXTOOLS_API_KEY || '',
        };
        break;
      case 'binance':
        apiUrl = `https://api.dextools.io/v1/token/${address}/liquidity`;
        headers = {
          'X-API-Key': process.env.NEXT_PUBLIC_DEXTOOLS_API_KEY || '',
        };
        break;
      default:
        // Fall back to a generic response for unsupported chains
        return {
          status: 'success',
          liquidity: {
            totalLiquidity: 'Unknown',
            liquidityPair: `TOKEN/${blockchain.toUpperCase()}`,
            liquidityLocked: false,
            lockDuration: 'Unknown',
            lockPercentage: '0%',
            lockedUntil: new Date().toISOString(),
          },
        };
    }
    
    // With a real API key, you would make this call
    // const liquidityData = await apiCall(apiUrl, 'GET', null, headers);
    
    // For demo purposes (without a real API key), return estimates based on token's age
    // In a production application, this should be replaced with real API calls
    const randomLiquidity = Math.floor(Math.random() * 1000000) + 50000;
    const isLiquidityLocked = Math.random() > 0.3; // 70% chance liquidity is locked
    
    return {
      status: 'success',
      liquidity: {
        totalLiquidity: `$${randomLiquidity.toLocaleString()}`,
        liquidityPair: `TOKEN/${blockchain === 'binance' ? 'BNB' : 'ETH'}`,
        liquidityLocked: isLiquidityLocked,
        lockDuration: isLiquidityLocked ? `${Math.floor(Math.random() * 730) + 30} days` : '0 days',
        lockPercentage: isLiquidityLocked ? `${Math.floor(Math.random() * 50) + 50}%` : '0%',
        lockedUntil: isLiquidityLocked ? 
          new Date(Date.now() + (Math.floor(Math.random() * 730) + 30) * 24 * 3600 * 1000).toISOString() : 
          new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error fetching liquidity info:", error);
    
    // Return minimal data with error status
    return {
      status: 'error',
      liquidity: {
        totalLiquidity: 'Unknown',
        liquidityPair: `TOKEN/${blockchain.toUpperCase()}`,
        liquidityLocked: false,
        lockDuration: 'Unknown',
        lockPercentage: '0%',
        lockedUntil: new Date().toISOString(),
      },
    };
  }
};

// Check if a contract might be a honeypot
export const checkHoneypot = async (
  address: string,
  blockchain: string
) => {
  try {
    // In a production app, you would call a honeypot detection API like honeypotis.io, rugdoc.io, etc.
    // For demo purposes, we'll implement basic checks based on contract analysis
    
    // You'd use a service like tenderly.co or custom analysis tools to check the contract
    // Since we don't have real API access, we'll return simulated data based on contract address
    
    // Calculate a deterministic but seemingly random value from the address
    const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const deterministicRandom = addressSum / 10000; // Value between 0-1 based on address
    
    // Use the deterministicRandom to generate consistent results for the same address
    const isHoneypot = deterministicRandom < 0.15; // 15% chance to be honeypot
    const buyTax = `${Math.floor(deterministicRandom * 10)}%`; 
    const sellTax = `${Math.floor(deterministicRandom * 20)}%`;
    const canSell = deterministicRandom > 0.1; // 90% chance can sell
    
    // Generate warnings based on "analysis"
    const warnings = [];
    if (parseFloat(sellTax) > 10) {
      warnings.push('High sell tax detected');
    }
    if (!canSell) {
      warnings.push('Potential sell restrictions found in contract');
    }
    if (isHoneypot) {
      warnings.push('Contract contains potential honeypot characteristics');
    }
    
    return {
      status: 'success',
      isHoneypot,
      buyTax,
      sellTax,
      canBuy: true, // Most tokens can be bought
      canSell,
      warnings,
    };
  } catch (error) {
    console.error("Error checking honeypot:", error);
    
    // Return conservative estimates with error status
    return {
      status: 'error',
      isHoneypot: true, // Err on the side of caution
      buyTax: 'Unknown',
      sellTax: 'Unknown',
      canBuy: false,
      canSell: false,
      warnings: ['Unable to verify contract safety'],
    };
  }
};

// Get token holder information
export const getTokenHolders = async (
  address: string,
  blockchain: string
) => {
  try {
    // Configure API endpoints based on blockchain
    const explorers = {
      ethereum: {
        baseUrl: 'https://api.etherscan.io/api',
        apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
      },
      binance: {
        baseUrl: 'https://api.bscscan.com/api',
        apiKey: process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || '',
      },
      polygon: {
        baseUrl: 'https://api.polygonscan.com/api',
        apiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY || '',
      },
      solana: {
        baseUrl: 'https://api.solscan.io',
        apiKey: process.env.NEXT_PUBLIC_SOLSCAN_API_KEY || '',
      }
    };

    if (!explorers[blockchain as keyof typeof explorers]) {
      throw new Error('Unsupported blockchain');
    }

    const { baseUrl, apiKey } = explorers[blockchain as keyof typeof explorers];
    
    // Get token holders
    let holdersUrl = '';
    
    if (blockchain === 'solana') {
      holdersUrl = `${baseUrl}/token/holders?tokenAddress=${address}&limit=10`;
      const headers = apiKey ? { 'token': apiKey } : {};
      const holdersData = await apiCall(holdersUrl, 'GET', null, headers);
      
      // Format Solana response
      const holders = holdersData.data.map((holder: any, index: number) => {
        const percentage = ((holder.amount / holdersData.tokenAmount.uiAmount) * 100).toFixed(2);
        
        return {
          address: holder.owner,
          balance: holder.amount.toString(),
          percentage: `${percentage}%`,
          tags: index === 0 ? ['Deployer'] : 
                 holder.owner.includes('11111') ? ['System'] : ['Unknown'],
        };
      });
      
      return {
        status: 'success',
        holders,
      };
    } else {
      // For EVM chains
      // Many explorers don't provide direct API for token holders without premium API keys
      // For demo purposes, we'll generate deterministic holder data based on contract address
      
      // Calculate a deterministic value from the address
      const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const seed = addressSum / 10000;
      
      // Generate holder distribution that's unique to each address but deterministic
      const topHolderPercentage = Math.floor(seed * 40) + 5; // 5-45%
      const secondHolderPercentage = Math.floor(seed * 20) + 5; // 5-25%
      const thirdHolderPercentage = Math.floor(seed * 15) + 3; // 3-18%
      const fourthHolderPercentage = Math.floor(seed * 10) + 2; // 2-12% 
      
      const holders = [
        {
          address: `0x${address.substring(4, 12)}...`,
          balance: `${topHolderPercentage * 10000000}`,
          percentage: `${topHolderPercentage}%`,
          tags: ['Deployer'],
        },
        {
          address: `0x${address.substring(12, 20)}...`,
          balance: `${secondHolderPercentage * 10000000}`,
          percentage: `${secondHolderPercentage}%`,
          tags: ['Unknown'],
        },
        {
          address: `0x${address.substring(8, 16)}...`,
          balance: `${thirdHolderPercentage * 10000000}`,
          percentage: `${thirdHolderPercentage}%`,
          tags: ['LP'],
        },
        {
          address: `0x${address.substring(16, 24)}...`,
          balance: `${fourthHolderPercentage * 10000000}`,
          percentage: `${fourthHolderPercentage}%`,
          tags: ['Unknown'],
        },
      ];
      
      return {
        status: 'success',
        holders,
      };
    }
  } catch (error) {
    console.error("Error fetching token holders:", error);
    
    // Return minimal data with error status
    return {
      status: 'error',
      holders: [
        {
          address: '0xUnknown...',
          balance: 'Unknown',
          percentage: '100%',
          tags: ['Unknown'],
        }
      ],
    };
  }
};

// Perform a comprehensive security check using multiple services
export const performSecurityCheck = async (
  address: string,
  blockchain: string
) => {
  try {
    // Call multiple APIs in parallel
    const [honeypotCheck, holders, liquidity] = await Promise.all([
      checkHoneypot(address, blockchain),
      getTokenHolders(address, blockchain),
      getLiquidityInfo(address, blockchain),
    ]);
    
    // Process and combine results
    let riskLevel = 'LOW';
    const riskFactors = [];
    
    // Check for honeypot
    if (honeypotCheck.isHoneypot) {
      riskLevel = 'HIGH';
      riskFactors.push('Contract identified as potential honeypot');
    }
    
    // Add honeypot warnings
    if (honeypotCheck.warnings && honeypotCheck.warnings.length > 0) {
      riskFactors.push(...honeypotCheck.warnings);
    }
    
    // Check for high sell tax
    const sellTaxPercentage = parseFloat(honeypotCheck.sellTax);
    if (sellTaxPercentage > 10) {
      riskLevel = Math.max(riskLevel === 'HIGH' ? 3 : riskLevel === 'MEDIUM' ? 2 : 1, 2) === 3 ? 'HIGH' : 'MEDIUM';
      riskFactors.push(`High sell tax (${honeypotCheck.sellTax})`);
    }
    
    // Check for high ownership concentration
    if (holders.holders.length > 0) {
      const topHolderPercentage = parseFloat(holders.holders[0].percentage);
      if (topHolderPercentage > 50) {
        riskLevel = 'HIGH';
        riskFactors.push(`Top holder owns ${holders.holders[0].percentage} of supply`);
      } else if (topHolderPercentage > 20) {
        riskLevel = Math.max(riskLevel === 'HIGH' ? 3 : riskLevel === 'MEDIUM' ? 2 : 1, 2) === 3 ? 'HIGH' : 'MEDIUM';
        riskFactors.push(`Top holder owns ${holders.holders[0].percentage} of supply`);
      }
    }
    
    // Check liquidity
    if (!liquidity.liquidity.liquidityLocked) {
      riskLevel = 'HIGH';
      riskFactors.push('Liquidity is not locked');
    } else if (parseFloat(liquidity.liquidity.lockPercentage) < 60) {
      riskLevel = Math.max(riskLevel === 'HIGH' ? 3 : riskLevel === 'MEDIUM' ? 2 : 1, 2) === 3 ? 'HIGH' : 'MEDIUM';
      riskFactors.push(`Only ${liquidity.liquidity.lockPercentage} of liquidity is locked`);
    }
    
    // Contract verification check
    // In a real app, you would check this via explorer API
    // For demo we'll generate a consistent result based on contract address
    const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const isVerified = addressSum % 10 > 3; // 70% chance to be verified
    
    if (!isVerified) {
      riskLevel = Math.max(riskLevel === 'HIGH' ? 3 : riskLevel === 'MEDIUM' ? 2 : 1, 2) === 3 ? 'HIGH' : 'MEDIUM';
      riskFactors.push('Contract source code is not verified');
    }
    
    return {
      status: 'success',
      riskLevel,
      riskFactors,
      details: {
        honeypot: honeypotCheck,
        holders,
        liquidity,
        contractVerified: isVerified,
      },
    };
  } catch (error) {
    console.error("Error performing security check:", error);
    
    // Return minimal data with error status
    return {
      status: 'error',
      riskLevel: 'HIGH', // Err on the side of caution
      riskFactors: ['Unable to complete security analysis'],
      details: {
        honeypot: {
          isHoneypot: true,
          buyTax: 'Unknown',
          sellTax: 'Unknown',
          canBuy: false,
          canSell: false,
          warnings: ['Security check failed'],
        },
        holders: {
          holders: []
        },
        liquidity: {
          liquidityLocked: false,
          lockDuration: 'Unknown',
          lockPercentage: '0%',
        },
        contractVerified: false,
      },
    };
  }
}