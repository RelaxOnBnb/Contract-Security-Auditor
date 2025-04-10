import { useState } from 'react';
import ScannerHeader from './ScannerHeader';
import AddressForm from './AddressForm';
import ContractForm from './ContractForm';
import Loading from './Loading';
import AuditResults from './AuditResults';

// Sample mock data for demonstration purposes
const mockVulnerabilities = [
  {
    id: '1',
    name: 'Reentrancy Vulnerability',
    description: 'The contract allows for state changes after external calls, making it vulnerable to reentrancy attacks.',
    severity: 'high',
    function: 'withdraw()',
    line: 142,
    solution: 'Implement a reentrancy guard using OpenZeppelin\'s ReentrancyGuard or ensure state changes occur before external calls.'
  },
  {
    id: '2',
    name: 'Unchecked External Call',
    description: 'The contract does not verify return values from external calls, potentially leading to silent failures.',
    severity: 'medium',
    function: 'transferTokens()',
    line: 87,
    solution: 'Always check the return value of external calls or use SafeERC20 for token transfers.'
  },
  {
    id: '3',
    name: 'Block Timestamp Dependence',
    description: 'Relying on block.timestamp as a source of randomness or for critical timing functions.',
    severity: 'low',
    function: 'calculateReward()',
    line: 221,
    solution: 'Avoid using block.timestamp for randomness. For time-dependent logic, be aware miners can manipulate it slightly.'
  }
];

const mockProjectInfo = {
  name: 'TokenSwap Contract',
  contractType: 'DeFi/AMM',
  tags: ['ERC-20', 'Swap', 'Liquidity', 'DeFi'],
  language: 'Solidity',
  auditDate: 'June 15, 2023',
  status: 'completed'
};

const mockSummary = {
  codeQuality: 'The code follows good Solidity practices but lacks thorough commenting. Function names are descriptive, and the contract is well-structured overall.',
  systemOverview: 'This contract implements a basic token swap mechanism allowing users to exchange ERC-20 tokens. It includes liquidity provisioning, fee collection, and basic price discovery mechanisms.',
  privilegedRoles: ['Owner', 'Admin', 'Fee Collector'],
  keyRisks: [
    'Centralization risks from owner privileges',
    'Price manipulation vulnerabilities in low-liquidity scenarios',
    'No formal verification of mathematical operations'
  ]
};

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

export default function Scanner() {
  const [activeTab, setActiveTab] = useState<'address' | 'contract'>('address');
  const [isLoading, setIsLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  
  const handleAddressSubmit = (contractAddress: string, blockchain: string) => {
    console.log(`Scanning address ${contractAddress} on ${blockchain}`);
    
    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setScanComplete(true);
    }, 5000); // Simulating a 5-second scan
  };
  
  const handleContractSubmit = (contractCode: string, contractType: string) => {
    console.log(`Scanning contract code of type ${contractType}`);
    
    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setScanComplete(true);
    }, 5000); // Simulating a 5-second scan
  };
  
  const handleTabChange = (tab: 'address' | 'contract') => {
    setActiveTab(tab);
    // Reset states when changing tabs
    setIsLoading(false);
    setScanComplete(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ScannerHeader activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!isLoading && !scanComplete && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Smart Contract Auditor</h1>
            <p className="mb-8 text-gray-600">
              Identify vulnerabilities in your smart contracts before deployment. Our AI-powered scanner checks for common security issues and best practices.
            </p>
            
            {activeTab === 'address' ? (
              <AddressForm onSubmit={handleAddressSubmit} isLoading={isLoading} />
            ) : (
              <ContractForm onSubmit={handleContractSubmit} isLoading={isLoading} />
            )}
          </div>
        )}
        
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Loading message={`Scanning ${activeTab === 'address' ? 'contract address' : 'contract code'}...`} />
          </div>
        )}
        
        {scanComplete && (
          <AuditResults 
            projectInfo={mockProjectInfo}
            summary={mockSummary}
            riskScore={72}
            vulnerabilities={mockVulnerabilities}
          />
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">© 2023 Audit Scanner. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}