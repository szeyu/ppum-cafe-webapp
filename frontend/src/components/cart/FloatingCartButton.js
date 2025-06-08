import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

function FloatingCartButton() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Show/hide button based on cart contents
  useEffect(() => {
    if (cartItemCount > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [cartItemCount]);

  // Animate when new items are added
  useEffect(() => {
    if (state.cartAnimation) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [state.cartAnimation]);

  const handleCartClick = () => {
    navigate('/cart');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40">
      <div 
        onClick={handleCartClick}
        className={`bg-primary-600 text-white rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 transform ${
          isAnimating ? 'scale-110 shadow-3xl' : 'hover:scale-105'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-xl">🛒</span>
              </div>
              {cartItemCount > 0 && (
                <div className={`absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${
                  isAnimating ? 'animate-pulse' : ''
                }`}>
                  {cartItemCount}
                </div>
              )}
            </div>
            
            <div>
              <div className="font-semibold">
                {cartItemCount} {t('cart.items') || 'item'}{cartItemCount !== 1 ? 's' : ''}
              </div>
              <div className="text-sm opacity-90">
                RM {cartTotal.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{t('cart.viewCart') || 'View Cart'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Animation overlay for new items */}
        {isAnimating && (
          <div className="absolute inset-0 bg-green-400 bg-opacity-30 rounded-2xl animate-ping"></div>
        )}
        
        {/* Recent item notification */}
        {state.cartAnimation && (
          <div className="absolute -top-12 left-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm animate-slide-down">
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>{state.cartAnimation.itemName} {t('cart.addedToCart') || 'added to cart'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FloatingCartButton; 