interface LoadingProps {
  message?: string;
  progress?: number; // 0-100 percent
}

export default function Loading({ message = 'Scanning contract...', progress }: LoadingProps) {
  // Define steps in the scanning process
  const steps = [
    { label: 'Connecting to blockchain', status: 'complete' },
    { label: 'Retrieving contract bytecode', status: 'complete' },
    { label: 'Analyzing smart contract patterns', status: progress && progress >= 30 ? (progress >= 50 ? 'complete' : 'active') : 'pending' },
    { label: 'Running vulnerability checks', status: progress && progress >= 50 ? (progress >= 80 ? 'complete' : 'active') : 'pending' },
    { label: 'Generating audit report', status: progress && progress >= 80 ? (progress >= 95 ? 'complete' : 'active') : 'pending' }
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-24 h-24 mb-6 animate-pulse-glow">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">{message}</h3>
      
      {/* Progress indicator */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Scanning in progress...</span>
          <span className="text-sm font-medium text-primary-600">{progress ? `${Math.round(progress)}%` : 'Initializing'}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-primary-600 rounded-full ${!progress ? 'progress-bar-animated animate-pulse w-1/4' : ''}`}
            style={{ width: progress ? `${progress}%` : undefined }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 w-full max-w-md">
        <h4 className="font-medium text-gray-700 mb-4 text-left">Scanning Process:</h4>
        <ul className="space-y-4 text-left">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center transition-all duration-300">
              {step.status === 'complete' ? (
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : step.status === 'active' ? (
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-primary-600 animate-pulse"></div>
                </div>
              ) : (
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                </div>
              )}
              <span className={`ml-3 text-sm font-medium ${
                step.status === 'complete' ? 'text-green-600' : 
                step.status === 'active' ? 'text-primary-600' : 
                'text-gray-500'
              }`}>
                {step.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-10 text-sm text-gray-500 flex items-center">
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        This may take a few minutes. Please do not close this page.
      </div>
    </div>
  );
}