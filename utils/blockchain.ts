import { ethers } from 'ethers';

// Standard ERC20 ABI for basic token information
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
  'event Approval(address indexed owner, address indexed spender, uint amount)'
];

// Interface for token info
export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

// Get provider based on blockchain
export const getProvider = (blockchain: string): ethers.JsonRpcProvider => {
  let rpcUrl: string;
  
  switch (blockchain) {
    case 'ethereum':
      rpcUrl = process.env.ETH_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo';
      break;
    case 'binance':
      rpcUrl = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org';
      break;
    case 'polygon':
      rpcUrl = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
      break;
    default:
      rpcUrl = 'https://eth-mainnet.g.alchemy.com/v2/demo';
  }
  
  return new ethers.JsonRpcProvider(rpcUrl);
};

// Get basic token information
export const getTokenInfo = async (
  contractAddress: string,
  blockchain: string
): Promise<TokenInfo | null> => {
  try {
    const provider = getProvider(blockchain);
    const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
    
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.totalSupply()
    ]);
    
    return {
      name,
      symbol,
      decimals,
      totalSupply: ethers.formatUnits(totalSupply, decimals)
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    return null;
  }
};

// Get contract code from blockchain
export const getContractCode = async (
  contractAddress: string,
  blockchain: string
): Promise<string | null> => {
  try {
    const provider = getProvider(blockchain);
    const code = await provider.getCode(contractAddress);
    
    // If contract is not deployed or doesn't have code
    if (code === '0x') {
      return null;
    }
    
    return code;
  } catch (error) {
    console.error('Error getting contract code:', error);
    return null;
  }
};

// Check if contract is verified on blockchain explorer
export const isContractVerified = async (
  contractAddress: string,
  blockchain: string
): Promise<boolean> => {
  try {
    // In a real app, you would call the explorer API to check if contract is verified
    // This is a placeholder function
    const explorerApiKey = blockchain === 'ethereum' 
      ? process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY 
      : process.env.NEXT_PUBLIC_BSCSCAN_API_KEY;
    
    // Mock implementation for demo
    return Promise.resolve(true);
  } catch (error) {
    console.error('Error checking contract verification:', error);
    return false;
  }
};

// Get token holders list from explorer API
export const getTokenHolders = async (
  contractAddress: string,
  blockchain: string
): Promise<any[]> => {
  try {
    // In a real app, you would call the explorer API to get top token holders
    // This is a placeholder function returning mock data
    return Promise.resolve([
      { address: '0x123...', balance: '10000000', percentage: '15%' },
      { address: '0x456...', balance: '8000000', percentage: '12%' },
      { address: '0x789...', balance: '5000000', percentage: '7.5%' },
    ]);
  } catch (error) {
    console.error('Error getting token holders:', error);
    return [];
  }
};

// Get contract deployment date
export const getContractDeploymentDate = async (
  contractAddress: string,
  blockchain: string
): Promise<string | null> => {
  try {
    // In a real app, this would check when the contract was created
    // This is a placeholder returning a mock date
    return Promise.resolve('2023-05-15');
  } catch (error) {
    console.error('Error getting deployment date:', error);
    return null;
  }
};

// Basic security analysis of contract code
export const analyzeContractSecurity = async (
  contractCode: string
): Promise<any> => {
  // In a real app, this would perform static analysis of the contract code
  // This is a placeholder returning mock analysis results
  const hasOwnerFunction = contractCode.includes('owner');
  const hasMintFunction = contractCode.includes('mint');
  const hasPauseFunction = contractCode.includes('pause');
  const hasBlacklistFunction = contractCode.includes('blacklist');
  
  return {
    hasOwnerRole: hasOwnerFunction,
    canMint: hasMintFunction,
    canPause: hasPauseFunction,
    hasBlacklist: hasBlacklistFunction,
    vulnerabilities: [
      // Example vulnerabilities that would be detected by a real scanner
      {
        name: 'Centralized Control',
        found: hasOwnerFunction,
        severity: 'medium',
      },
      {
        name: 'Unlimited Minting',
        found: hasMintFunction,
        severity: 'high',
      },
      {
        name: 'Trading Restrictions',
        found: hasPauseFunction,
        severity: 'medium',
      },
      {
        name: 'Blacklist Capability',
        found: hasBlacklistFunction,
        severity: 'medium',
      }
    ]
  };
}; 