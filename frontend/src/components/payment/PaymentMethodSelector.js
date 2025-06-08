import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

function PaymentMethodSelector({ 
  paymentMethod, 
  onPaymentMethodChange, 
  disabled = false 
}) {
  const { t } = useTranslation();

  const paymentOptions = [
    { value: 'Online Payment', label: t('payment.onlinePayment') || 'Online Payment' },
    { value: 'Cash at Counter', label: t('payment.cashAtCounter') || 'Cash at Counter' }
  ];

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">{t('payment.paymentMethod') || 'Payment Method'}</h3>
      
      <div className="space-y-3">
        {paymentOptions.map(option => (
          <label 
            key={option.value}
            className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer"
          >
            <input
              type="radio"
              name="payment"
              value={option.value}
              checked={paymentMethod === option.value}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              className="w-5 h-5 text-primary-600"
              disabled={disabled}
            />
            <span className="flex-1 font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethodSelector; 