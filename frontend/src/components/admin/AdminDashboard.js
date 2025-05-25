import React from 'react';

function AdminDashboard({ stats, formatDateTime }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🏪</div>
            <div>
              <p className="text-sm text-gray-600">Total Stalls</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total_stalls || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🍽️</div>
            <div>
              <p className="text-sm text-gray-600">Menu Items</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total_menu_items || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📋</div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total_orders || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👥</div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total_users || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {stats.recent_orders && stats.recent_orders.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recent_orders.map(order => (
                <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-600">{formatDateTime(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">RM {order.total_amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 