import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MenuItemDetail from './MenuItemDetail';

function MenuItemCard({ item }) {
  const { dispatch } = useApp();
  const [showDetail, setShowDetail] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  return (
    <>
      <div 
        onClick={() => setShowDetail(true)}
        className="card cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="flex space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                {item.isBestSeller && (
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded-full mb-1">
                    Best Seller
                  </span>
                )}
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="font-bold text-primary-600">RM {item.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500">{item.nutrition.calories} kcal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="btn-primary w-full mt-3"
        >
          ADD TO CART
        </button>
      </div>

      {showDetail && (
        <MenuItemDetail 
          item={item} 
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}

export default MenuItemCard; 