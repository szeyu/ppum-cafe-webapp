import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

function StallCard({ stall, onStallClick }) {
  const { t } = useTranslation();

  const formatStallName = (stall) => {
    if (!stall) return 'Unknown Stall';
    
    const englishName = stall.name;
    const bmName = stall.name_bm;
    
    // If both names exist and are different, show both
    if (bmName && bmName.trim() && bmName !== englishName) {
      return `${englishName} / ${bmName}`;
    }
    
    // Otherwise just show the English name
    return englishName;
  };

  const formatCuisineType = (stall) => {
    if (!stall) return 'Unknown Cuisine';
    
    const englishType = stall.cuisine_type;
    const bmType = stall.cuisine_type_bm;
    
    // If both types exist and are different, show both
    if (bmType && bmType.trim() && bmType !== englishType) {
      return `${englishType} / ${bmType}`;
    }
    
    // Otherwise just show the English type
    return englishType;
  };

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
          <h3 className="font-semibold text-lg text-gray-800">{formatStallName(stall)}</h3>
          <p className="text-gray-600 text-sm">{formatCuisineType(stall)}</p>
          <div className="flex items-center mt-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm text-gray-600 ml-1">{stall.rating}</span>
          </div>
          {stall.best_seller && (
            <p className="text-xs text-orange-600 mt-1">
              {t('home.bestSeller') || 'Best Seller'}: {stall.best_seller}
            </p>
          )}
        </div>
        
        <button className="btn-primary text-sm px-4 py-2">
          {t('home.orderButton') || 'ORDER'}
        </button>
      </div>
    </div>
  );
}

export default StallCard; 