import React from 'react';
import { useNavigate } from 'react-router-dom';

function Notification() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-green-600 mb-2">Ready for Pickup!</h2>
          
          <p className="text-gray-600 mb-1">
            Your order from Malay Delights is ready for pickup!
          </p>
          
          <p className="text-gray-600 mb-6">
            Please proceed to counter #3 to collect your food.
          </p>
          
          <button
            onClick={() => navigate('/orders')}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg w-full"
          >
            VIEW ORDER
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification; 