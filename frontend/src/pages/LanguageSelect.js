import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function LanguageSelect() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const handleLanguageSelect = (language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Choose Language</h1>
        
        <div className="space-y-4 w-full max-w-xs">
          <button
            onClick={() => handleLanguageSelect('English')}
            className={`w-full py-4 px-6 rounded-full font-medium transition-colors ${
              state.language === 'English'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            English
          </button>
          
          <button
            onClick={() => handleLanguageSelect('BM')}
            className={`w-full py-4 px-6 rounded-full font-medium transition-colors ${
              state.language === 'BM'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            BM
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate('/home')}
        className="btn-primary w-full max-w-xs"
      >
        CONTINUE
      </button>
    </div>
  );
}

export default LanguageSelect; 