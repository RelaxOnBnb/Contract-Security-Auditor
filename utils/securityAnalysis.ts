// Interface for vulnerability
export interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  function?: string;
  line?: number;
  solution: string;
}

// Basic vulnerability patterns to look for in smart contracts
const VULNERABILITY_PATTERNS = {
  reentrancy: {
    regex: /(\.\s*call\s*{.*}\s*\(.*\))(?!.*\s+\_amount\s*=\s*0)/gi,
    severity: 'high',
    description: 'Potential reentrancy vulnerability. External call is made before state variables are updated.',
    solution: 'Follow the checks-effects-interactions pattern: update state variables before making external calls.'
  },
  txOrigin: {
    regex: /tx\.origin/gi,
    severity: 'high',
    description: 'Usage of tx.origin for authorization which is unsafe and vulnerable to phishing attacks.',
    solution: 'Use msg.sender instead of tx.origin for authorization.'
  },
  uncheckedCallReturn: {
    regex: /\.call\{.*\}\(.*\)(?!.*require\(|\.\s*transfer|\.\s*send)/gi,
    severity: 'medium',
    description: 'Unchecked return value from low-level call. This could lead to silent failures.',
    solution: 'Always check the return value of low-level calls or use the SafeERC20 library.'
  },
  ownerPrivileges: {
    regex: /onlyOwner|Ownable|require\(\s*msg\.sender\s*==\s*owner\s*\)/gi,
    severity: 'medium',
    description: 'Owner has high privileges in the contract. This could be risky if the owner is malicious or compromised.',
    solution: 'Consider implementing a multi-signature mechanism for sensitive operations or removing/renouncing ownership.'
  },
  transferOwnership: {
    regex: /transferOwnership/gi,
    severity: 'low',
    description: 'Contract allows ownership transfer which could be exploited if not properly secured.',
    solution: 'Ensure ownership transfers have proper security mechanisms like multi-sig or timelock delays.'
  },
  hardcodedAddress: {
    regex: /address\s*\(\s*0x[a-fA-F0-9]{40}\s*\)/gi,
    severity: 'low',
    description: 'Hardcoded addresses in the contract can cause issues if those addresses need to change.',
    solution: 'Use state variables that can be updated by governance or admin functions instead of hardcoded addresses.'
  },
  pauseableTokens: {
    regex: /pause|pausable|whenNotPaused/gi,
    severity: 'medium',
    description: 'Contract includes functions to pause operations, giving owners significant control.',
    solution: 'If pausability is required, implement proper governance around the pause functionality.'
  },
  blacklistFeature: {
    regex: /blacklist|blocklist|banned|exclude/gi,
    severity: 'medium',
    description: 'Contract has ability to blacklist/block addresses from transacting.',
    solution: 'Blacklist functionality should be transparent and ideally governed by community voting.'
  },
  mintingFunction: {
    regex: /mint(?!.*burn)|function\s+mint/gi,
    severity: 'high',
    description: 'Contract can mint new tokens which may lead to supply inflation.',
    solution: 'Implement minting caps, timelock periods, or community governance for minting operations.'
  },
  selfDestruct: {
    regex: /selfdestruct|suicide/gi,
    severity: 'high',
    description: 'Contract can be self-destructed, which could lead to loss of funds and contract state.',
    solution: 'Remove self-destruct functionality or implement strong access controls and time delays.'
  }
};

// Analyze contract code for known vulnerabilities
export const analyzeContractVulnerabilities = (
  contractCode: string
): Vulnerability[] => {
  const vulnerabilities: Vulnerability[] = [];
  
  // For each vulnerability pattern, check if it's present in the code
  Object.entries(VULNERABILITY_PATTERNS).forEach(([key, pattern]) => {
    const matches = contractCode.match(pattern.regex);
    
    if (matches && matches.length > 0) {
      // Find approximate line number for the first instance
      const lines = contractCode.split('\n');
      let lineNumber = 0;
      let found = false;
      
      for (let i = 0; i < lines.length; i++) {
        if (pattern.regex.test(lines[i])) {
          lineNumber = i + 1;
          found = true;
          break;
        }
      }
      
      // Reset regex lastIndex
      pattern.regex.lastIndex = 0;
      
      vulnerabilities.push({
        id: `V-${key}-${Date.now()}`,
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        description: pattern.description,
        severity: pattern.severity as 'high' | 'medium' | 'low',
        line: found ? lineNumber : undefined,
        solution: pattern.solution
      });
    }
  });
  
  return vulnerabilities;
};

// Calculate risk score based on vulnerabilities
export const calculateRiskScore = (vulnerabilities: Vulnerability[]): number => {
  if (vulnerabilities.length === 0) {
    return 0;
  }
  
  // Assign weights to different severity levels
  const severityWeights = {
    high: 25,
    medium: 10,
    low: 3
  };
  
  // Calculate weighted score
  let totalScore = 0;
  vulnerabilities.forEach(vuln => {
    totalScore += severityWeights[vuln.severity];
  });
  
  // Cap at 100
  return Math.min(100, totalScore);
};

// Analyze contract owner permissions
export const analyzeOwnerPermissions = (contractCode: string): string[] => {
  const permissions = [];
  
  // Check for common owner permission patterns
  if (/mint.*onlyOwner|onlyOwner.*mint/gi.test(contractCode)) {
    permissions.push('Owner can mint new tokens');
  }
  
  if (/pause.*onlyOwner|onlyOwner.*pause/gi.test(contractCode)) {
    permissions.push('Owner can pause trading');
  }
  
  if (/excludeFromFee.*onlyOwner|onlyOwner.*excludeFromFee/gi.test(contractCode)) {
    permissions.push('Owner can exclude addresses from fees');
  }
  
  if (/setFee.*onlyOwner|onlyOwner.*setFee/gi.test(contractCode)) {
    permissions.push('Owner can modify fees');
  }
  
  if (/withdraw.*onlyOwner|onlyOwner.*withdraw/gi.test(contractCode)) {
    permissions.push('Owner can withdraw funds');
  }
  
  if (/blacklist.*onlyOwner|onlyOwner.*blacklist/gi.test(contractCode)) {
    permissions.push('Owner can blacklist addresses');
  }
  
  if (/maxTx.*onlyOwner|onlyOwner.*maxTx/gi.test(contractCode)) {
    permissions.push('Owner can set maximum transaction amount');
  }
  
  return permissions;
};

// Generate a summary of the contract audit
export const generateAuditSummary = (
  contractCode: string,
  vulnerabilities: Vulnerability[]
): any => {
  // Basic code quality assessment
  const linesOfCode = contractCode.split('\n').length;
  const commentCount = (contractCode.match(/\/\//g) || []).length + (contractCode.match(/\/\*[\s\S]*?\*\//g) || []).length;
  const commentRatio = commentCount / linesOfCode;
  
  let codeQuality = '';
  if (commentRatio < 0.05) {
    codeQuality = 'The contract has minimal comments, which makes it harder to understand and audit.';
  } else if (commentRatio < 0.15) {
    codeQuality = 'The contract has a moderate level of comments, but more detailed documentation would be beneficial.';
  } else {
    codeQuality = 'The contract is well-commented, which is good for clarity and maintainability.';
  }
  
  // Check for common good practices
  if (contractCode.includes('SafeMath') || contractCode.includes('using SafeMath')) {
    codeQuality += ' The contract uses SafeMath to prevent integer overflows, which is a good security practice.';
  }
  
  if (contractCode.includes('ReentrancyGuard') || contractCode.includes('nonReentrant')) {
    codeQuality += ' The contract implements reentrancy guards to prevent reentrancy attacks.';
  }
  
  // Analyze owner permissions
  const ownerPermissions = analyzeOwnerPermissions(contractCode);
  
  // Calculate risk score
  const riskScore = calculateRiskScore(vulnerabilities);
  
  return {
    codeQuality,
    systemOverview: `This is a ${linesOfCode > 1000 ? 'complex' : 'standard'} smart contract with ${linesOfCode} lines of code.`,
    privilegedRoles: ownerPermissions,
    keyRisks: vulnerabilities.map(v => v.description),
    riskScore,
    vulnerabilitiesCount: {
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      medium: vulnerabilities.filter(v => v.severity === 'medium').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length,
    }
  };
}; 