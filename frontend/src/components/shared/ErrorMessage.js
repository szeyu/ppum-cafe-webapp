import React from 'react';

function ErrorMessage({ 
  title = "Something went wrong",
  message = "An error occurred. Please try again.",
  onRetry,
  retryText = "Try Again",
  fullScreen = false,
  icon = "⚠️",
  className = ""
}) {
  const containerClasses = fullScreen 
    ? "min-h-screen bg-gray-50 flex items-center justify-center px-6"
    : "text-center py-12";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">{icon}</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage; 