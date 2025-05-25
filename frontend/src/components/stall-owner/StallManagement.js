import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import ApiService from '../../services/api';
import { BottomNav } from '../shared';

function StallManagement() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [stallOrders, setStallOrders] = useState([]);
  const [foodTrackers, setFoodTrackers] = useState([]);
  const [stallInfo, setStallInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Menu item management states
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [showCreateMenuModal, setShowCreateMenuModal] = useState(false);

  useEffect(() => {
    if (state.user && state.user.role === 'stall_owner') {
      loadStallData();
    }
  }, [state.user, activeTab]);

  const loadStallData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stall information
      const stall = await ApiService.getStallOwnerStall();
      setStallInfo(stall);

      if (activeTab === 'orders') {
        // Load stall orders
        const orders = await ApiService.getStallOrders();
        setStallOrders(orders);
      } else if (activeTab === 'food-tracking') {
        // Load food trackers
        const trackers = await ApiService.getStallFoodTrackers();
        setFoodTrackers(trackers);
      } else if (activeTab === 'menu-items') {
        // Load menu items for this stall
        const items = await ApiService.getStallMenuItems();
        setMenuItems(items);
      }

    } catch (error) {
      console.error('Error loading stall data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFoodTrackerStatus = async (trackerId, newStatus) => {
    try {
      await ApiService.updateStallFoodTrackerStatus(trackerId, newStatus);
      // Reload food trackers
      const trackers = await ApiService.getStallFoodTrackers();
      setFoodTrackers(trackers);
      
      // Also reload orders to update overall order status
      const orders = await ApiService.getStallOrders();
      setStallOrders(orders);
    } catch (error) {
      console.error('Error updating food tracker status:', error);
      setError(error.message);
    }
  };

  const handleCreateMenuItem = async (itemData) => {
    try {
      setLoading(true);
      await ApiService.createStallMenuItem({
        ...itemData,
        stall_id: stallInfo.id
      });
      setShowCreateMenuModal(false);
      await loadStallData(); // Reload menu items
      setError(null);
    } catch (error) {
      console.error('Error creating menu item:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMenuItem = async (itemData) => {
    try {
      setLoading(true);
      await ApiService.updateStallMenuItem(editingMenuItem.id, itemData);
      setEditingMenuItem(null);
      await loadStallData(); // Reload menu items
      setError(null);
    } catch (error) {
      console.error('Error updating menu item:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }
    
    try {
      setLoading(true);
      await ApiService.deleteStallMenuItem(itemId);
      await loadStallData(); // Reload menu items
      setError(null);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Queued': return 'bg-yellow-100 text-yellow-800';
      case 'Preparing': return 'bg-blue-100 text-blue-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Collected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!state.user || state.user.role !== 'stall_owner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need to be a stall owner to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stall data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Stall Management</h1>
            {stallInfo && (
              <p className="mt-2 text-gray-600">Managing: {stallInfo.name}</p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders ({stallOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('food-tracking')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'food-tracking'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Food Tracking ({foodTrackers.filter(t => t.status !== 'Collected').length})
            </button>
            <button
              onClick={() => setActiveTab('menu-items')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'menu-items'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Menu Items ({menuItems.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <button
                onClick={loadStallData}
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
        )}

        {activeTab === 'food-tracking' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Food Tracking</h2>
              <button
                onClick={loadStallData}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Refresh
              </button>
            </div>

            {foodTrackers.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No items to track</h3>
                <p className="mt-1 text-sm text-gray-500">No food items are currently being prepared.</p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {foodTrackers.map((tracker) => (
                    <li key={tracker.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {tracker.menu_item?.name || 'Unknown Item'} (Item #{tracker.item_number})
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tracker.status)}`}>
                                {tracker.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              Order #{tracker.order?.order_number} • Customer: {tracker.order?.user?.name || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Queue Position: {tracker.queue_position} • 
                              Est. Ready: {formatTime(tracker.estimated_ready_time)}
                            </p>
                            {tracker.prep_start_time && (
                              <p className="text-sm text-gray-500">
                                Started: {formatTime(tracker.prep_start_time)}
                              </p>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="mt-3 flex space-x-2">
                            {tracker.status === 'Queued' && (
                              <button
                                onClick={() => updateFoodTrackerStatus(tracker.id, 'Preparing')}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700"
                              >
                                Start Preparing
                              </button>
                            )}
                            {tracker.status === 'Preparing' && (
                              <button
                                onClick={() => updateFoodTrackerStatus(tracker.id, 'Ready')}
                                className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700"
                              >
                                Mark Ready
                              </button>
                            )}
                            {tracker.status === 'Ready' && (
                              <button
                                onClick={() => updateFoodTrackerStatus(tracker.id, 'Collected')}
                                className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-700"
                              >
                                Mark Collected
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu-items' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
              <button
                onClick={() => setShowCreateMenuModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Add New Item
              </button>
            </div>

            {menuItems.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first menu item.</p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {menuItems.map((item) => (
                    <li key={item.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex space-x-2">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {item.is_available ? 'Available' : 'Unavailable'}
                              </span>
                              {item.is_best_seller && (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                  Best Seller
                                </span>
                              )}
                              {item.is_hospital_friendly && (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Hospital Friendly
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                              <span>RM {item.price.toFixed(2)}</span>
                              <span>•</span>
                              <span>{item.category}</span>
                              {item.calories && (
                                <>
                                  <span>•</span>
                                  <span>{item.calories} cal</span>
                                </>
                              )}
                            </div>
                            {item.allergens && item.allergens.length > 0 && (
                              <div className="mt-1">
                                <span className="text-xs text-red-600">
                                  Allergens: {item.allergens.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => setEditingMenuItem(item)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Menu Item Modal */}
      {showCreateMenuModal && (
        <MenuItemModal
          item={{
            name: '',
            description: '',
            price: 0,
            category: 'Meals',
            is_best_seller: false,
            is_available: true,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            is_hospital_friendly: false,
            allergens: []
          }}
          onSave={handleCreateMenuItem}
          onCancel={() => setShowCreateMenuModal(false)}
          title="Add New Menu Item"
        />
      )}

      {/* Edit Menu Item Modal */}
      {editingMenuItem && (
        <MenuItemModal
          item={editingMenuItem}
          onSave={handleUpdateMenuItem}
          onCancel={() => setEditingMenuItem(null)}
          title="Edit Menu Item"
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

// Menu Item Modal Component
function MenuItemModal({ item, onSave, onCancel, title }) {
  const [formData, setFormData] = useState(item);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="Meals">Meals</option>
                <option value="Drinks">Drinks</option>
                <option value="Snacks">Snacks</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.protein}
                  onChange={(e) => setFormData({...formData, protein: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.carbs}
                  onChange={(e) => setFormData({...formData, carbs: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.fat}
                  onChange={(e) => setFormData({...formData, fat: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergens (comma-separated)</label>
              <input
                type="text"
                value={formData.allergens ? formData.allergens.join(', ') : ''}
                onChange={(e) => setFormData({...formData, allergens: e.target.value.split(',').map(a => a.trim()).filter(a => a)})}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., nuts, dairy, gluten"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_best_seller}
                  onChange={(e) => setFormData({...formData, is_best_seller: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Best Seller</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Available</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_hospital_friendly}
                  onChange={(e) => setFormData({...formData, is_hospital_friendly: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Hospital Friendly</span>
              </label>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StallManagement; 