import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export function useStallData(activeTab, user) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Stall data
  const [stallInfo, setStallInfo] = useState(null);
  const [stallOrders, setStallOrders] = useState([]);
  const [foodTrackers, setFoodTrackers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  // Load data based on active tab
  useEffect(() => {
    if (user && user.role === 'stall_owner') {
      loadStallData();
    }
  }, [user, activeTab]);

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

  // Food tracker operations
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

  // Menu item operations
  const handleCreateMenuItem = async (itemData) => {
    try {
      setLoading(true);
      await ApiService.createStallMenuItem({
        ...itemData,
        stall_id: stallInfo.id
      });
      await loadStallData(); // Reload menu items
      setError(null);
      return true; // Success
    } catch (error) {
      console.error('Error creating menu item:', error);
      setError(error.message);
      return false; // Failure
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMenuItem = async (itemId, itemData) => {
    try {
      setLoading(true);
      await ApiService.updateStallMenuItem(itemId, itemData);
      await loadStallData(); // Reload menu items
      setError(null);
      return true; // Success
    } catch (error) {
      console.error('Error updating menu item:', error);
      setError(error.message);
      return false; // Failure
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return false;
    }
    
    try {
      setLoading(true);
      await ApiService.deleteStallMenuItem(itemId);
      await loadStallData(); // Reload menu items
      setError(null);
      return true; // Success
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setError(error.message);
      return false; // Failure
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
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

  return {
    // State
    loading,
    error,
    stallInfo,
    stallOrders,
    foodTrackers,
    menuItems,
    
    // Actions
    loadStallData,
    updateFoodTrackerStatus,
    handleCreateMenuItem,
    handleUpdateMenuItem,
    handleDeleteMenuItem,
    
    // Utilities
    getStatusColor,
    formatTime,
    formatDate,
    
    // Setters for error handling
    setError
  };
} 