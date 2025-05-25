import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomNav } from '../shared';
import { useStallData } from '../../hooks/useStallData';

// Import new components
import StallOrders from './StallOrders';
import FoodTracking from './FoodTracking';
import StallMenuItems from './StallMenuItems';
import MenuItemModal from './MenuItemModal';

function StallManagement() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  
  // Modal states
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [showCreateMenuModal, setShowCreateMenuModal] = useState(false);

  // Use custom hook for data management
  const {
    loading,
    error,
    stallInfo,
    stallOrders,
    foodTrackers,
    menuItems,
    loadStallData,
    updateFoodTrackerStatus,
    handleCreateMenuItem,
    handleUpdateMenuItem,
    handleDeleteMenuItem,
    getStatusColor,
    formatTime,
    formatDate,
    setError
  } = useStallData(activeTab, state.user);

  // Modal handlers
  const handleShowCreateModal = () => {
    setShowCreateMenuModal(true);
  };

  const handleCreateMenuItemSubmit = async (itemData) => {
    const success = await handleCreateMenuItem(itemData);
    if (success) {
      setShowCreateMenuModal(false);
    }
  };

  const handleEditMenuItem = (item) => {
    setEditingMenuItem(item);
  };

  const handleUpdateMenuItemSubmit = async (itemData) => {
    const success = await handleUpdateMenuItem(editingMenuItem.id, itemData);
    if (success) {
      setEditingMenuItem(null);
    }
  };

  const tabs = [
    { id: 'orders', name: 'Orders', count: stallOrders.length },
    { id: 'food-tracking', name: 'Food Tracking', count: foodTrackers.filter(t => t.status !== 'Collected').length },
    { id: 'menu-items', name: 'Menu Items', count: menuItems.length }
  ];

  // Access control
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

  // Loading state
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

      {/* Error Display */}
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
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'orders' && (
          <StallOrders
            stallOrders={stallOrders}
            stallInfo={stallInfo}
            onRefresh={loadStallData}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'food-tracking' && (
          <FoodTracking
            foodTrackers={foodTrackers}
            onRefresh={loadStallData}
            onUpdateStatus={updateFoodTrackerStatus}
            getStatusColor={getStatusColor}
            formatTime={formatTime}
          />
        )}

        {activeTab === 'menu-items' && (
          <StallMenuItems
            menuItems={menuItems}
            onAddNewItem={handleShowCreateModal}
            onEditItem={handleEditMenuItem}
            onDeleteItem={handleDeleteMenuItem}
          />
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
          onSave={handleCreateMenuItemSubmit}
          onCancel={() => setShowCreateMenuModal(false)}
          title="Add New Menu Item"
        />
      )}

      {/* Edit Menu Item Modal */}
      {editingMenuItem && (
        <MenuItemModal
          item={editingMenuItem}
          onSave={handleUpdateMenuItemSubmit}
          onCancel={() => setEditingMenuItem(null)}
          title="Edit Menu Item"
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default StallManagement; 