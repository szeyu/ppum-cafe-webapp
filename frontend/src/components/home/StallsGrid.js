import React from 'react';
import StallCard from './StallCard';
import { EmptyState } from '../shared';

function StallsGrid({ stalls, onStallClick }) {
  if (stalls.length === 0) {
    return (
      <EmptyState
        icon="🏪"
        title="No stalls found"
        message="Try adjusting your search terms."
      />
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