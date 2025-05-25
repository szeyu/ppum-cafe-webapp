import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

function OrderTrackingDetail({ orderId, onClose }) {
  const { getOrderTracking, state } = useApp();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracking();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadTracking, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  const loadTracking = async () => {
    try {
      const trackingData = await getOrderTracking(orderId);
      if (trackingData) {
      setTracking(trackingData);
      } else {
        // If tracking data is null, it might be due to auth issues
        // Add a small delay before closing to allow auth system to recover
        console.log('No tracking data received, waiting before closing modal...');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error('Error loading tracking:', error);
      // Don't set tracking to null immediately, let the auth system handle it
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Queued': return 'bg-gray-500';
      case 'Preparing': return 'bg-blue-500';
      case 'Ready': return 'bg-green-500';
      case 'Collected': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Queued': return '⏳';
      case 'Preparing': return '👨‍🍳';
      case 'Ready': return '✅';
      case 'Collected': return '📦';
      default: return '⏳';
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (estimatedTime) => {
    const now = new Date();
    const estimated = new Date(estimatedTime);
    const diff = estimated - now;
    
    if (diff <= 0) return 'Ready now';
    
    const minutes = Math.ceil(diff / (1000 * 60));
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p>Loading order tracking...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <p className="text-red-600">Error loading order tracking</p>
            <button onClick={onClose} className="btn-primary mt-4">Close</button>
          </div>
        </div>
      </div>
    );
  }

  const { order, food_trackers, ready_items, preparing_items, queued_items } = tracking;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Order #{order.order_number}</h2>
              <p className="text-gray-600 text-sm">
                Placed at {formatTime(order.created_at)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Order Status Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Order Status: {order.status}</h3>
                <p className="text-gray-600">
                  {ready_items.length > 0 && (
                    <span className="text-green-600 font-medium">
                      {ready_items.length} item{ready_items.length !== 1 ? 's' : ''} ready for pickup!
                    </span>
                  )}
                  {ready_items.length === 0 && preparing_items.length > 0 && (
                    <span className="text-blue-600">
                      {preparing_items.length} item{preparing_items.length !== 1 ? 's' : ''} being prepared
                    </span>
                  )}
                  {ready_items.length === 0 && preparing_items.length === 0 && (
                    <span className="text-gray-600">
                      {queued_items.length} item{queued_items.length !== 1 ? 's' : ''} in queue
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  RM {order.total_amount.toFixed(2)}
                </div>
                {order.estimated_completion_time && (
                  <div className="text-sm text-gray-600">
                    Est. completion: {formatTime(order.estimated_completion_time)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ready Items */}
          {ready_items.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                <span className="text-xl mr-2">🍽️</span>
                Ready for Pickup ({ready_items.length})
              </h4>
              <div className="space-y-3">
                {ready_items.map((tracker) => (
                  <div key={tracker.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{tracker.menu_item.name}</h5>
                        <p className="text-sm text-gray-600">
                          Item {tracker.item_number} • {tracker.stall.name}
                        </p>
                        {tracker.actual_ready_time && (
                          <p className="text-xs text-green-600">
                            Ready at {formatTime(tracker.actual_ready_time)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(tracker.status)}`}>
                          <span className="mr-1">{getStatusIcon(tracker.status)}</span>
                          {tracker.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preparing Items */}
          {preparing_items.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
                <span className="text-xl mr-2">👨‍🍳</span>
                Being Prepared ({preparing_items.length})
              </h4>
              <div className="space-y-3">
                {preparing_items.map((tracker) => (
                  <div key={tracker.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{tracker.menu_item.name}</h5>
                        <p className="text-sm text-gray-600">
                          Item {tracker.item_number} • {tracker.stall.name}
                        </p>
                        <p className="text-xs text-blue-600">
                          Est. ready: {getTimeRemaining(tracker.estimated_ready_time)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(tracker.status)}`}>
                          <span className="mr-1">{getStatusIcon(tracker.status)}</span>
                          {tracker.status}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {tracker.prep_duration_minutes} min prep
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar for preparing items */}
                    {tracker.prep_start_time && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.min(100, ((Date.now() - new Date(tracker.prep_start_time)) / (tracker.prep_duration_minutes * 60 * 1000)) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Queued Items */}
          {queued_items.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-600 mb-3 flex items-center">
                <span className="text-xl mr-2">⏳</span>
                In Queue ({queued_items.length})
              </h4>
              <div className="space-y-3">
                {queued_items.map((tracker) => (
                  <div key={tracker.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{tracker.menu_item.name}</h5>
                        <p className="text-sm text-gray-600">
                          Item {tracker.item_number} • {tracker.stall.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Queue position: #{tracker.queue_position}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(tracker.status)}`}>
                          <span className="mr-1">{getStatusIcon(tracker.status)}</span>
                          {tracker.status}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Est. {getTimeRemaining(tracker.estimated_ready_time)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>RM {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>RM {order.service_fee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>RM {order.total_amount.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Payment: {order.payment_method}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTrackingDetail; 