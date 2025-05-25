import React from 'react';

function StallCard({ stall, onStallClick }) {
  return (
    <div
      onClick={() => onStallClick(stall.id)}
      className="card cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg flex items-center justify-center">
          <span className="text-2xl">🍽️</span>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{stall.name}</h3>
          <p className="text-gray-600 text-sm">{stall.cuisine_type}</p>
          <div className="flex items-center mt-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm text-gray-600 ml-1">{stall.rating}</span>
          </div>
          {stall.best_seller && (
            <p className="text-xs text-orange-600 mt-1">Best Seller: {stall.best_seller}</p>
          )}
        </div>
        
        <button className="btn-primary text-sm px-4 py-2">
          ORDER
        </button>
      </div>
    </div>
  );
}

export default StallCard; 