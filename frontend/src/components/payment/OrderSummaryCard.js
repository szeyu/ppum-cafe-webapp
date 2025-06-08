import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

function OrderSummaryCard({ groupedCart, subtotal, serviceFee, total }) {
  const { t } = useTranslation();

  const formatMenuItemName = (menuItem) => {
    if (!menuItem) return 'Unknown Item';
    
    const englishName = menuItem.name;
    const bmName = menuItem.name_bm;
    
    // If both names exist and are different, show both
    if (bmName && bmName.trim() && bmName !== englishName) {
      return `${englishName} / ${bmName}`;
    }
    
    // Otherwise just show the English name
    return englishName;
  };

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">{t('cart.orderSummary') || 'Order Summary'}</h3>
      
      {Object.entries(groupedCart).map(([stallName, items]) => (
        <div key={stallName} className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">
            {stallName}: {items.length} {t('payment.item') || 'item'}{items.length > 1 ? 's' : ''}
          </h4>
          {items.map(item => (
            <div key={item.id} className="text-sm text-gray-600">
              {formatMenuItemName(item)} (x{item.quantity}) - RM {(item.price * item.quantity).toFixed(2)}
            </div>
          ))}
        </div>
      ))}
      
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{t('cart.subtotal') || 'Subtotal'}</span>
          <span>RM {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{t('cart.serviceFee') || 'Service Fee'}</span>
          <span>RM {serviceFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>{t('cart.total') || 'Total'}</span>
          <span className="text-primary-600">RM {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryCard; 