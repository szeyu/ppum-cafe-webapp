import React from 'react';

function PaymentButton({ 
  total, 
  isProcessing, 
  onPayment, 
  disabled = false 
}) {
  return (
    <button
      onClick={onPayment}
      disabled={isProcessing || disabled}
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
  );
}

export default PaymentButton; 