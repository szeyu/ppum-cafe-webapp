import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useTranslation } from '../../hooks/useTranslation';
import { PageHeader } from '../shared';

// Import cart components
import EmptyCart from './EmptyCart';
import CartStallGroup from './CartStallGroup';
import CartSummary from './CartSummary';

function Cart() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    isEmpty,
    groupedCart,
    calculations,
    updateQuantity,
    removeFromCart
  } = useCart();

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  if (isEmpty) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader title={t('cart.myCart') || 'My Cart'} />

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