import React from 'react';
import { useNavigate } from 'react-router-dom';

function Splash() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <div className="bg-primary-100 rounded-2xl p-8 mb-8 inline-block">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">PPUM CAFÉ</h1>
        </div>
        
        <div className="space-y-2 text-gray-600">
          <p className="text-lg">Order from Any Stall.</p>
          <p className="text-lg">One Scan. One App.</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/language')}
        className="btn-primary w-full max-w-xs text-lg"
      >
        START
      </button>
    </div>
  );
}

export default Splash; 