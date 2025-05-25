import React from 'react';

function EmptyCart({ onBrowseStalls }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some delicious items from our stalls!</p>
        <button
          onClick={onBrowseStalls}
          className="btn-primary"
        >
          Browse Stalls
        </button>
      </div>
    </div>
  );
}

export default EmptyCart; 