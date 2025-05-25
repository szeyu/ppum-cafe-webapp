import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BottomNav, OrderTrackingDetail } from '../components';

function Orders() {
  const navigate = useNavigate();
  const { state, loadUserOrders } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      await loadUserOrders();
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-blue-100 text-blue-800';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'Partially Ready': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted': return '✅';
      case 'Preparing': return '👨‍🍳';
      case 'Partially Ready': return '🍽️';
      case 'Completed': return '✅';
      case 'Cancelled': return '❌';
      default: return '⏳';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderSummary = (order) => {
    const totalItems = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const stallNames = [...new Set(order.order_items?.map(item => item.stall?.name) || [])];
    
    return {
      totalItems,
      stallNames: stallNames.slice(0, 2), // Show max 2 stall names
      hasMoreStalls: stallNames.length > 2
    };
  };
      
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          </div>
        </div>
        
        <div className="max-w-md mx-auto px-4 py-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card mb-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600 mt-1">Track your food orders</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {state.orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">Start ordering from your favorite stalls!</p>
            <button 
              onClick={() => navigate('/home')}
              className="btn-primary"
            >
              Browse Stalls
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {state.orders.map((order) => {
              const summary = getOrderSummary(order);
              
              return (
                <div 
                  key={order.id} 
                  className="card hover-lift cursor-pointer"
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-800">
                          Order #{order.order_number}
                        </span>
                        <span className={`badge ${getStatusColor(order.status)}`}>
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          {order.status}
                    </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-600">
                        RM {order.total_amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {summary.totalItems} item{summary.totalItems !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-2">
                      From: {summary.stallNames.join(', ')}
                      {summary.hasMoreStalls && ' +more'}
                </div>

                    {order.order_items && order.order_items.length > 0 && (
                      <div className="space-y-1">
                        {order.order_items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.quantity}x {item.menu_item?.name || 'Unknown Item'}
                            </span>
                            <span className="text-gray-600">
                              RM {item.total_price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {order.order_items.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{order.order_items.length - 2} more items
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status-specific information */}
                  {order.status === 'Partially Ready' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center text-orange-700">
                        <span className="text-lg mr-2">🍽️</span>
                        <span className="text-sm font-medium">
                          Some items are ready for pickup!
                        </span>
                      </div>
                    </div>
                  )}

                  {order.status === 'Completed' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center text-green-700">
                        <span className="text-lg mr-2">✅</span>
                        <span className="text-sm font-medium">
                          Order ready for pickup!
                        </span>
                      </div>
                    </div>
                  )}

                  {order.estimated_completion_time && order.status !== 'Completed' && (
                    <div className="text-xs text-gray-500">
                      Est. completion: {new Date(order.estimated_completion_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}

                  {/* Action indicator */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600">
                      Payment: {order.payment_method}
                    </span>
                    <div className="flex items-center text-primary-600 text-sm">
                      <span>Track Order</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Tracking Detail Modal */}
      {selectedOrderId && (
        <OrderTrackingDetail 
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}

export default Orders; 