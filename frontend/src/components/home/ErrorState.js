import React from 'react';

function ErrorState({ error, onRetry }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={onRetry} 
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default ErrorState; 