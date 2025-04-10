import { useState } from 'react';

interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  function?: string;
  line?: number;
  solution: string;
}

interface AuditResultsProps {
  projectInfo: {
    name: string;
    contractType: string;
    tags: string[];
    language: string;
    auditDate: string;
    status: 'completed' | 'in-progress';
  };
  summary: {
    codeQuality: string;
    systemOverview: string;
    privilegedRoles: string[];
    keyRisks: string[];
  };
  riskScore: number;
  vulnerabilities: Vulnerability[];
}

export default function AuditResults({
  projectInfo,
  summary,
  riskScore,
  vulnerabilities,
}: AuditResultsProps) {
  const [activeTab, setActiveTab] = useState('summary');
  
  const highVulnerabilities = vulnerabilities.filter(v => v.severity === 'high');
  const mediumVulnerabilities = vulnerabilities.filter(v => v.severity === 'medium');
  const lowVulnerabilities = vulnerabilities.filter(v => v.severity === 'low');
  
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary-600 text-white p-6">
        <h2 className="text-2xl font-bold">{projectInfo.name} Audit Results</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {projectInfo.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-white/20 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-white/70">Contract Type</p>
            <p className="font-medium">{projectInfo.contractType}</p>
          </div>
          <div>
            <p className="text-xs text-white/70">Language</p>
            <p className="font-medium">{projectInfo.language}</p>
          </div>
          <div>
            <p className="text-xs text-white/70">Audit Date</p>
            <p className="font-medium">{projectInfo.auditDate}</p>
          </div>
          <div>
            <p className="text-xs text-white/70">Status</p>
            <p className={`font-medium ${projectInfo.status === 'completed' ? 'text-green-300' : 'text-yellow-300'}`}>
              {projectInfo.status === 'completed' ? 'Completed' : 'In Progress'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'summary' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'vulnerabilities' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Vulnerabilities ({vulnerabilities.length})
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="mr-3">
              <div className="text-xl font-bold">{riskScore}/100</div>
              <div className="text-xs text-gray-500">Risk Score</div>
            </div>
            <div className="w-20 h-20 rounded-full flex justify-center items-center" style={{ 
              background: `conic-gradient(${getRiskColor(riskScore)} ${riskScore}%, #f3f4f6 0)` 
            }}>
              <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center">
                <span className="font-bold text-lg">{riskScore}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {activeTab === 'summary' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Code Quality Assessment</h3>
              <p className="text-gray-700">{summary.codeQuality}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">System Overview</h3>
              <p className="text-gray-700">{summary.systemOverview}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Privileged Roles</h3>
              <ul className="list-disc pl-5 space-y-1">
                {summary.privilegedRoles.map((role, index) => (
                  <li key={index} className="text-gray-700">{role}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Key Risks Identified</h3>
              <ul className="list-disc pl-5 space-y-1">
                {summary.keyRisks.map((risk, index) => (
                  <li key={index} className="text-gray-700">{risk}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Findings Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="text-red-700 font-bold text-lg">{highVulnerabilities.length}</div>
                  <div className="text-red-700">High Risk Findings</div>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="text-yellow-700 font-bold text-lg">{mediumVulnerabilities.length}</div>
                  <div className="text-yellow-700">Medium Risk Findings</div>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="text-green-700 font-bold text-lg">{lowVulnerabilities.length}</div>
                  <div className="text-green-700">Low Risk Findings</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'vulnerabilities' && (
          <div>
            {highVulnerabilities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-red-600">High Risk Vulnerabilities</h3>
                <div className="space-y-4">
                  {highVulnerabilities.map(vuln => (
                    <div key={vuln.id} className="border border-red-200 rounded-md p-4 bg-red-50">
                      <h4 className="font-semibold text-red-700">{vuln.name}</h4>
                      <p className="text-gray-700 mt-2">{vuln.description}</p>
                      {vuln.function && (
                        <div className="mt-2">
                          <span className="text-sm font-medium">Function: </span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{vuln.function}</code>
                        </div>
                      )}
                      {vuln.line && (
                        <div className="mt-1">
                          <span className="text-sm font-medium">Line: </span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{vuln.line}</code>
                        </div>
                      )}
                      <div className="mt-3">
                        <span className="text-sm font-medium block mb-1">Recommended Solution:</span>
                        <p className="text-gray-700 text-sm">{vuln.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {mediumVulnerabilities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-yellow-600">Medium Risk Vulnerabilities</h3>
                <div className="space-y-4">
                  {mediumVulnerabilities.map(vuln => (
                    <div key={vuln.id} className="border border-yellow-200 rounded-md p-4 bg-yellow-50">
                      <h4 className="font-semibold text-yellow-700">{vuln.name}</h4>
                      <p className="text-gray-700 mt-2">{vuln.description}</p>
                      {vuln.function && (
                        <div className="mt-2">
                          <span className="text-sm font-medium">Function: </span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{vuln.function}</code>
                        </div>
                      )}
                      {vuln.line && (
                        <div className="mt-1">
                          <span className="text-sm font-medium">Line: </span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{vuln.line}</code>
                        </div>
                      )}
                      <div className="mt-3">
                        <span className="text-sm font-medium block mb-1">Recommended Solution:</span>
                        <p className="text-gray-700 text-sm">{vuln.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {lowVulnerabilities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">Low Risk Vulnerabilities</h3>
                <div className="space-y-4">
                  {lowVulnerabilities.map(vuln => (
                    <div key={vuln.id} className="border border-green-200 rounded-md p-4 bg-green-50">
                      <h4 className="font-semibold text-green-700">{vuln.name}</h4>
                      <p className="text-gray-700 mt-2">{vuln.description}</p>
                      {vuln.function && (
                        <div className="mt-2">
                          <span className="text-sm font-medium">Function: </span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{vuln.function}</code>
                        </div>
                      )}
                      {vuln.line && (
                        <div className="mt-1">
                          <span className="text-sm font-medium">Line: </span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{vuln.line}</code>
                        </div>
                      )}
                      <div className="mt-3">
                        <span className="text-sm font-medium block mb-1">Recommended Solution:</span>
                        <p className="text-gray-700 text-sm">{vuln.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {vulnerabilities.length === 0 && (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Vulnerabilities Found</h3>
                <p className="text-gray-600">This contract appears to be secure based on our scan.</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <button className="btn-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
} 