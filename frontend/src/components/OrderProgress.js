import React from 'react';

function OrderProgress({ status }) {
  const steps = ['Accepted', 'Preparing', 'Ready'];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentStepIndex 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-400'
            }`}>
              {index <= currentStepIndex ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>
            <span className={`text-xs mt-1 ${
              index <= currentStepIndex ? 'text-green-600' : 'text-gray-400'
            }`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`absolute h-0.5 w-16 mt-4 ${
                index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
              }`} style={{ left: `${(index + 1) * 33.33}%`, transform: 'translateX(-50%)' }} />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-500">~10 min</span>
      </div>
    </div>
  );
}

export default OrderProgress; 