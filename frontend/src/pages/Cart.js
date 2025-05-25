import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import stallsData from '../data/stalls.json';

function Cart() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const groupedCart = state.cart.reduce((groups, item) => {
    const stall = stallsData.find(s => s.id === item.stallId);
    const stallName = stall ? stall.name : 'Unknown Stall';
    
    if (!groups[stallName]) {
      groups[stallName] = [];
    }
    groups[stallName].push(item);
    return groups;
  }, {});

  const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const serviceFee = 1.50;
  const total = subtotal + serviceFee;
  const totalCalories = state.cart.reduce((total, item) => total + (item.nutrition.calories * item.quantity), 0);

  const handleRemoveItem = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items from our stalls!</p>
          <button
            onClick={() => navigate('/home')}
            className="btn-primary"
          >
            Browse Stalls
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">My Cart</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Cart Items by Stall */}
        {Object.entries(groupedCart).map(([stallName, items]) => (
          <div key={stallName} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">{stallName}</h2>
            
            {items.map(item => (
              <div key={item.id} className="card">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🍽️</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-primary-600 font-medium">RM {item.price.toFixed(2)} × {item.quantity}</p>
                    <p className="text-xs text-gray-500">{item.nutrition.calories * item.quantity} kcal</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <span className="text-lg">−</span>
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center"
                    >
                      <span className="text-lg">+</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Order Summary */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>RM {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee</span>
              <span>RM {serviceFee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary-600">RM {total.toFixed(2)}</span>
            </div>
          </div>
          
          <p className="text-sm text-orange-600 mb-4">
            Nutrition Summary: {totalCalories} kcal
          </p>
          
          <button
            onClick={() => navigate('/payment')}
            className="btn-primary w-full"
          >
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart; 