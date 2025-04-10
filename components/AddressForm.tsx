import { useState } from 'react';

interface AddressFormProps {
  onSubmit: (data: { address: string; blockchain: string }) => void;
  isLoading: boolean;
}

export default function AddressForm({ onSubmit, isLoading }: AddressFormProps) {
  const [contractAddress, setContractAddress] = useState('');
  const [blockchain, setBlockchain] = useState('ethereum');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contractAddress.trim()) {
      alert('Please enter a contract address');
      return;
    }
    
    // Basic validation for Ethereum/BSC address
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(contractAddress)) {
      alert('Please enter a valid contract address (0x followed by 40 hexadecimal characters)');
      return;
    }
    
    onSubmit({
      address: contractAddress,
      blockchain: blockchain
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <label htmlFor="blockchain" className="block text-sm font-medium text-gray-700 mb-2">
          Blockchain
        </label>
        <select
          id="blockchain"
          value={blockchain}
          onChange={(e) => setBlockchain(e.target.value)}
          className="input-field"
        >
          <option value="ethereum">Ethereum</option>
          <option value="binance">BNB Chain (BSC)</option>
          <option value="polygon">Polygon</option>
          <option value="solana">Solana</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="optimism">Optimism</option>
          <option value="avalanche">Avalanche</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Contract Address
        </label>
        <input
          id="contractAddress"
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="0x..."
          className="input-field font-mono"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Scanning...' : 'Scan Address'}
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="text-md font-semibold mb-2">Recent Scanned Projects</h3>
        <ul className="space-y-2">
          <li className="text-sm text-blue-600 hover:underline cursor-pointer">
            0x1234...5678 (Ethereum) - SHIB Token
          </li>
          <li className="text-sm text-blue-600 hover:underline cursor-pointer">
            0x8765...4321 (BSC) - PEPE Token
          </li>
          <li className="text-sm text-blue-600 hover:underline cursor-pointer">
            0xabcd...efgh (Polygon) - DOGE Token
          </li>
        </ul>
      </div>
    </form>
  );
} 