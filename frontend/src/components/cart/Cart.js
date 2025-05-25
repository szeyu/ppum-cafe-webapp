import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

// Import cart components
import EmptyCart from './EmptyCart';
import CartStallGroup from './CartStallGroup';
import CartSummary from './CartSummary';

function Cart() {
  const navigate = useNavigate();
  const {
    isEmpty,
    groupedCart,
    calculations,
    updateQuantity,
    removeFromCart
  } = useCart();

  const handleBrowseStalls = () => {
    navigate('/home');
  };

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  if (isEmpty) {
    return <EmptyCart onBrowseStalls={handleBrowseStalls} />;
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
          <CartStallGroup
            key={stallName}
            stallName={stallName}
            items={items}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
          />
        ))}

        {/* Order Summary */}
        <CartSummary
          subtotal={calculations.subtotal}
          serviceFee={calculations.serviceFee}
          total={calculations.total}
          totalCalories={calculations.totalCalories}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
    </div>
  );
}

export default Cart; 