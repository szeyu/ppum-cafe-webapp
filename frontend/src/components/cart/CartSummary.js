import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

function CartSummary({ 
  subtotal, 
  serviceFee, 
  total, 
  totalCalories, 
  onProceedToPayment 
}) {
  const { t } = useTranslation();

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">{t('cart.orderSummary') || 'Order Summary'}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('cart.subtotal') || 'Subtotal'}</span>
          <span>RM {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">{t('cart.serviceFee') || 'Service Fee'}</span>
          <span>RM {serviceFee.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold text-lg">
          <span>{t('cart.total') || 'Total'}</span>
          <span className="text-primary-600">RM {total.toFixed(2)}</span>
        </div>
      </div>
      
      {totalCalories > 0 && (
        <p className="text-sm text-orange-600 mb-4">
          {t('cart.nutritionSummary') || 'Nutrition Summary'}: {totalCalories} kcal
        </p>
      )}
      
      <button
        onClick={onProceedToPayment}
        className="btn-primary w-full"
      >
        {t('cart.proceedToPayment') || 'PROCEED TO PAYMENT'}
      </button>
    </div>
  );
}

export default CartSummary; 