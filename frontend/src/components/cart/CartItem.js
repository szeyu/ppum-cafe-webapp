import React from 'react';

function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem 
}) {
  return (
    <div className="card">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-xl">🍽️</span>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          <p className="text-primary-600 font-medium">RM {item.price.toFixed(2)} × {item.quantity}</p>
          {item.calories && (
            <p className="text-xs text-gray-500">{item.calories * item.quantity} kcal</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            <span className="text-lg">−</span>
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center"
          >
            <span className="text-lg">+</span>
          </button>
        </div>
        
        <button
          onClick={() => onRemoveItem(item.id)}
          className="p-2 text-red-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CartItem; 