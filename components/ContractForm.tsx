import { useState } from 'react';

interface ContractFormProps {
  onSubmit: (data: { code: string; type: string }) => void;
  isLoading: boolean;
}

export default function ContractForm({ onSubmit, isLoading }: ContractFormProps) {
  const [contractCode, setContractCode] = useState('');
  const [contractType, setContractType] = useState('erc20');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contractCode.trim()) {
      alert('Please enter contract code');
      return;
    }
    
    onSubmit({
      code: contractCode,
      type: contractType
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 mb-2">
          Contract Type
        </label>
        <select
          id="contractType"
          value={contractType}
          onChange={(e) => setContractType(e.target.value)}
          className="input-field"
        >
          <option value="erc20">ERC-20 Token</option>
          <option value="erc721">ERC-721 (NFT)</option>
          <option value="bep20">BEP-20 Token</option>
          <option value="custom">Custom Contract</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label htmlFor="contractCode" className="block text-sm font-medium text-gray-700 mb-2">
          Smart Contract Code
        </label>
        <textarea
          id="contractCode"
          value={contractCode}
          onChange={(e) => setContractCode(e.target.value)}
          rows={15}
          placeholder="Paste your smart contract code here..."
          className="input-field font-mono text-sm"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setContractCode('')}
          className="btn-secondary"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Scanning...' : 'Scan Contract'}
        </button>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Or upload a smart contract file:
        </p>
        <label 
          htmlFor="fileUpload" 
          className="mt-2 cursor-pointer inline-block px-4 py-2 border border-dashed border-gray-300 rounded-md hover:border-primary-500 transition-colors duration-200"
        >
          <span className="text-primary-600">Choose File</span>
          <input
            id="fileUpload"
            type="file"
            accept=".sol,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Here you would implement file reading logic
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) {
                    setContractCode(event.target.result as string);
                  }
                };
                reader.readAsText(file);
              }
            }}
          />
        </label>
      </div>
    </form>
  );
} 