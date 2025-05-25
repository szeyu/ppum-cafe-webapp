import React from 'react';
import { useNavigate } from 'react-router-dom';

function PageHeader({ title, showBackButton = true, onBackClick, className = "" }) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`bg-primary-600 text-white p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <button onClick={handleBackClick} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </div>
  );
}

export default PageHeader; 