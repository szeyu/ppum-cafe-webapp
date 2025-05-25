import React from 'react';

function OrderHistory({ orders }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">My Orders</h3>
      
      {orders.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 2).map(order => (
            <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Order #{order.order_number}</p>
                <p className="text-sm text-gray-600">
                  {order.order_items?.map(item => 
                    `${item.menu_item?.name || 'Unknown Item'} (x${item.quantity})`
                  ).join(', ')}
                </p>
                <p className="text-sm text-gray-500">
                  RM {order.total_amount?.toFixed(2) || '0.00'}
                </p>
              </div>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm">
                Reorder
              </button>
            </div>
          ))}
          
          {orders.length > 2 && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Order #{orders[2].order_number}</p>
                <p className="text-sm text-gray-600">
                  {orders[2].order_items?.map(item => 
                    `${item.menu_item?.name || 'Unknown Item'} (x${item.quantity})`
                  ).join(', ')}
                </p>
              </div>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm">
                Reorder
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
