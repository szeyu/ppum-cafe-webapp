import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { 
  PageHeader, 
  EmptyState,
  PaymentMethodSelector,
  OrderSummaryCard,
  PaymentButton,
  usePayment
} from '../components';

function Payment() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    groupedCart,
    calculations,
    handlePayment,
    isEmpty
  } = usePayment();

  if (isEmpty) {
    return (
      <EmptyState
        icon="🛒"
        title={t('cart.empty') || 'Your cart is empty'}
        message={t('payment.emptyMessage') || 'Add some items to proceed with payment.'}
        actionText={t('cart.browseStalls') || 'Browse Stalls'}
        onAction={() => navigate('/home')}
        fullScreen
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader title={t('payment.title') || 'Payment'} />

      <div className="p-4 space-y-6">
        {/* Payment Method */}
        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          disabled={isProcessing}
        />

        {/* Order Summary */}
        <OrderSummaryCard
          groupedCart={groupedCart}
          subtotal={calculations.subtotal}
          serviceFee={calculations.serviceFee}
          total={calculations.total}
        />

        {/* Pay Button */}
        <PaymentButton
          total={calculations.total}
          isProcessing={isProcessing}
          onPayment={handlePayment}
        />
      </div>
    </div>
  );
}

export default Payment; 