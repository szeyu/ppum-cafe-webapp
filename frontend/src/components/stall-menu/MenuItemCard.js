import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import MenuItemDetail from './MenuItemDetail';

function MenuItemCard({ item }) {
  const { dispatch, state } = useApp();
  const [showDetail, setShowDetail] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if this item was just added to cart
  useEffect(() => {
    if (state.cartAnimation && state.cartAnimation.itemId === item.id) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.cartAnimation, item.id]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!state.isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    setIsAdding(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      dispatch({ type: 'ADD_TO_CART', payload: item });
      setIsAdding(false);
    }, 300);
  };

  const getCartQuantity = () => {
    const cartItem = state.cart.find(cartItem => cartItem.id === item.id);
    return cartItem ? cartItem.quantity : 0;
  };

  const cartQuantity = getCartQuantity();

  return (
    <>
      <div 
        onClick={() => setShowDetail(true)}
        className={`card cursor-pointer hover:shadow-lg transition-all duration-300 transform ${
          showSuccess ? 'scale-105 ring-2 ring-green-400' : 'hover:scale-102'
        }`}
      >
        <div className="flex space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg flex items-center justify-center relative overflow-hidden">
            <span className="text-2xl">🍽️</span>
            {showSuccess && (
              <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                <div className="text-green-600 text-lg animate-bounce">✓</div>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                {item.is_best_seller && (
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded-full mb-1">
                    Best Seller
                  </span>
                )}
                {item.is_hospital_friendly && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-1 ml-1">
                    Hospital-Friendly
                  </span>
                )}
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="font-bold text-primary-600">RM {item.price.toFixed(2)}</span>
                  {item.calories && (
                    <span className="text-xs text-gray-500">{item.calories} kcal</span>
                  )}
                  {item.current_queue_count > 0 && (
                    <span className="text-xs text-orange-500">
                      {item.current_queue_count} in queue
                    </span>
                  )}
                </div>
                {item.allergens && item.allergens.length > 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    Contains: {item.allergens.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handleAddToCart}
            disabled={!item.is_available || isAdding}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              !item.is_available 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isAdding
                ? 'bg-blue-400 text-white'
                : showSuccess
                ? 'bg-green-500 text-white'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {!item.is_available ? (
              'UNAVAILABLE'
            ) : isAdding ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ADDING...
              </div>
            ) : showSuccess ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                ADDED TO CART
              </div>
            ) : (
              'ADD TO CART'
            )}
          </button>
          
          {cartQuantity > 0 && (
            <div className="ml-3 bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-pulse">
              {cartQuantity}
            </div>
          )}
        </div>

        {/* Estimated prep time */}
        {item.base_prep_time && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            Est. prep time: {Math.ceil(item.base_prep_time * item.complexity_multiplier)} min
            {item.current_queue_count > 0 && ` (+${item.current_queue_count * 2} min queue)`}
          </div>
        )}
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