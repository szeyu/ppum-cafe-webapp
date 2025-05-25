import React from 'react';
import StallCard from './StallCard';

function StallsGrid({ stalls, onStallClick }) {
  if (stalls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏪</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No stalls found</h2>
        <p className="text-gray-600">Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-4">
      {stalls.map(stall => (
        <StallCard
          key={stall.id}
          stall={stall}
          onStallClick={onStallClick}
        />
      ))}
    </div>
  );
}

export default StallsGrid; 