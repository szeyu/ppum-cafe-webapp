import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function Payment() {
  const navigate = useNavigate();
  const { state, createOrder } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('Online Payment');
  const [isProcessing, setIsProcessing] = useState(false);

  const groupedCart = state.cart.reduce((groups, item) => {
    const stallName = item.stall?.name || 'Unknown Stall';
    
    if (!groups[stallName]) {
      groups[stallName] = [];
    }
    groups[stallName].push(item);
    return groups;
  }, {});

  const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const serviceFee = 1.50;
  const total = subtotal + serviceFee;

  const handlePayment = async () => {
    if (state.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create order via API
      const order = await createOrder(paymentMethod);

    // Navigate to order tracking
    navigate('/orders');
    
      // Show notification after a delay (simulating order processing)
    setTimeout(() => {
      navigate('/notification');
    }, 15000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to proceed with payment.</p>
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
          <h1 className="text-xl font-bold">Payment</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Payment Method */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="Online Payment"
                checked={paymentMethod === 'Online Payment'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-primary-600"
                disabled={isProcessing}
              />
              <span className="flex-1 font-medium">Online Payment</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="Cash at Counter"
                checked={paymentMethod === 'Cash at Counter'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-primary-600"
                disabled={isProcessing}
              />
              <span className="flex-1 font-medium">Cash at Counter</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
          
          {Object.entries(groupedCart).map(([stallName, items]) => (
            <div key={stallName} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">{stallName}: {items.length} item{items.length > 1 ? 's' : ''}</h4>
              {items.map(item => (
                <div key={item.id} className="text-sm text-gray-600">
                  {item.name} (x{item.quantity}) - RM {(item.price * item.quantity).toFixed(2)}
                </div>
              ))}
            </div>
          ))}
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>RM {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Service Fee</span>
              <span>RM {serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary-600">RM {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              PROCESSING...
            </div>
          ) : (
            `PAY NOW - RM ${total.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
}

export default Payment; 