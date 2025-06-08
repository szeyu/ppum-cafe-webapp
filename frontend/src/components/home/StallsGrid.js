import React from 'react';
import StallCard from './StallCard';
import { EmptyState } from '../shared';
import { useTranslation } from '../../hooks/useTranslation';

function StallsGrid({ stalls, onStallClick, popularTitle = "Popular Stalls", allStallsTitle = "All Stalls" }) {
  const { t } = useTranslation();
  
  if (stalls.length === 0) {
    return (
      <EmptyState
        icon="🏪"
        title={t('common.noResults')}
        message={t('common.tryAdjustingSearch')}
      />
    );
  }

  // Split stalls into popular and non-popular
  const popularStalls = stalls.filter(stall => stall.rating >= 4.5);
  const otherStalls = stalls.filter(stall => stall.rating < 4.5);

  return (
    <div className="px-4 space-y-6">
      {popularStalls.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">{popularTitle}</h2>
          <div className="space-y-4">
            {popularStalls.map(stall => (
              <StallCard
                key={stall.id}
                stall={stall}
                onStallClick={onStallClick}
              />
            ))}
          </div>
        </div>
      )}
      
      {otherStalls.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">{allStallsTitle}</h2>
          <div className="space-y-4">
            {otherStalls.map(stall => (
              <StallCard
                key={stall.id}
                stall={stall}
                onStallClick={onStallClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StallsGrid; 