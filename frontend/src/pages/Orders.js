import React from 'react';
import { useApp } from '../context/AppContext';
import stallsData from '../data/stalls.json';
import BottomNav from '../components/BottomNav';
import OrderProgress from '../components/OrderProgress';

function Orders() {
  const { state } = useApp();

  const groupOrdersByStall = (order) => {
    return order.items.reduce((groups, item) => {
      const stall = stallsData.find(s => s.id === item.stallId);
      const stallName = stall ? stall.name : 'Unknown Stall';
      
      if (!groups[stallName]) {
        groups[stallName] = [];
      }
      groups[stallName].push(item);
      return groups;
    }, {});
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <h1 className="text-xl font-bold text-center">Track Orders</h1>
      </div>

      <div className="p-4">
        {state.orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600">Your orders will appear here once you place them.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {state.orders.map(order => (
              <div key={order.id} className="card">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">Order {order.id}</h3>
                    <span className="text-sm text-gray-500">
                      Estimated ready by: {order.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Order items grouped by stall */}
                {Object.entries(groupOrdersByStall(order)).map(([stallName, items]) => (
                  <div key={stallName} className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">{stallName}</h4>
                    
                    {items.map(item => (
                      <div key={item.id} className="text-sm text-gray-600 mb-1">
                        {item.name} (x{item.quantity})
                      </div>
                    ))}

                    <OrderProgress status={order.status} />
                  </div>
                ))}

                {/* My Favorites Button */}
                <button className="w-full mt-4 py-3 border border-primary-600 text-primary-600 rounded-lg font-medium">
                  MY FAVORITES
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default Orders; 