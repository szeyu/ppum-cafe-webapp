import React from 'react';

function StallOrders({ 
  stallOrders, 
  stallInfo, 
  onRefresh, 
  getStatusColor, 
  formatDate 
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
        <button
          onClick={onRefresh}
          className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
        >
          Refresh
        </button>
      </div>

      {stallOrders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">No orders have been placed for your stall yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {stallOrders.map((order) => (
              <li key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600">
                        Order #{order.order_number}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-900">
                        Customer: {order.user?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)} • RM {order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Items:</p>
                      <ul className="mt-1 text-sm text-gray-500">
                        {order.order_items?.filter(item => item.stall_id === stallInfo?.id).map((item, index) => (
                          <li key={index}>
                            {item.quantity}x {item.menu_item?.name || 'Unknown Item'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StallOrders; 