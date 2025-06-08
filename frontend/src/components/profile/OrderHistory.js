import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

function OrderHistory({ orders }) {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ready':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
      <h3 className="font-semibold text-gray-800 mb-4">
        {t('profile.orderHistory.title') || 'My Orders'}
      </h3>
      
      {orders.length === 0 ? (
        <p className="text-gray-600 text-center py-4">
          {t('profile.orderHistory.noOrders') || 'No orders yet'}
        </p>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 3).map(order => (
            <div key={order.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800">
                    {t('profile.orderHistory.orderNumber') || 'Order'} #{order.order_number}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  {order.order_items?.map(item => 
                    `${formatMenuItemName(item.menu_item)} (x${item.quantity})`
                  ).join(', ')}
                </p>
                <p className="text-sm font-medium text-gray-800 mt-1">
                  RM {order.total_amount?.toFixed(2) || '0.00'}
                </p>
              </div>
              
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors">
                {t('profile.orderHistory.reorder') || 'Reorder'}
              </button>
            </div>
          ))}
          
          {orders.length > 3 && (
            <div className="text-center pt-2">
              <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                {t('profile.orderHistory.viewAll') || 'View All Orders'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
