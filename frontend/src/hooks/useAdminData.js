import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export function useAdminData(activeTab, user) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dashboard data
  const [stats, setStats] = useState({});
  
  // Stalls data
  const [stalls, setStalls] = useState([]);
  
  // Users data
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [stallOwners, setStallOwners] = useState([]);

  // Load data based on active tab
  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'dashboard':
          const statsData = await ApiService.getAdminStats();
          setStats(statsData);
          break;
        case 'stalls':
          const stallsData = await ApiService.getStalls();
          setStalls(stallsData);
          break;
        case 'users':
          await loadUsersByRole();
          // Also load stalls for role assignment
          const stallsForUsers = await ApiService.getStalls();
          setStalls(stallsForUsers);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsersByRole = async () => {
    try {
      const [allUsers, adminUsers, stallOwnerUsers] = await Promise.all([
        ApiService.getUsersByRole('user'),
        ApiService.getUsersByRole('admin'),
        ApiService.getUsersByRole('stall_owner')
      ]);
      
      setUsers(allUsers);
      setAdmins(adminUsers);
      setStallOwners(stallOwnerUsers);
    } catch (error) {
      console.error('Error loading users by role:', error);
      setError(error.message);
    }
  };

  // Stall operations
  const handleDeleteStall = async (stallId) => {
    if (!window.confirm('Are you sure you want to delete this stall? This will also delete all its menu items.')) {
      return;
    }
    
    try {
      await ApiService.deleteStall(stallId);
      setStalls(stalls.filter(stall => stall.id !== stallId));
      alert('Stall deleted successfully!');
    } catch (err) {
      alert('Error deleting stall: ' + err.message);
    }
  };

  const handleUpdateStall = async (stallData) => {
    try {
      if (stallData.id) {
        // Update existing stall
        await ApiService.updateStall(stallData.id, stallData);
        alert('Stall updated successfully!');
      } else {
        // Create new stall
        await ApiService.createStall(stallData);
        alert('Stall created successfully!');
      }
      loadData();
    } catch (err) {
      alert('Error saving stall: ' + err.message);
    }
  };

  // User operations
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will delete all their orders and data.')) {
      return;
    }
    
    try {
      await ApiService.deleteUser(userId);
      // Refresh user data
      await loadUsersByRole();
      alert('User deleted successfully!');
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const handleChangeUserRole = async (roleChangeData) => {
    try {
      setLoading(true);
      await ApiService.changeUserRole(roleChangeData.email, roleChangeData.newRole, roleChangeData.stallId);
      await loadUsersByRole();
      setError(null);
      return true; // Success
    } catch (error) {
      console.error('Error changing user role:', error);
      setError(error.message);
      return false; // Failure
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (createUserData) => {
    try {
      if (createUserData.password !== createUserData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      setLoading(true);
      await ApiService.createUserByAdmin({
        name: createUserData.name,
        email: createUserData.email,
        password: createUserData.password,
        role: createUserData.role,
        stall_id: createUserData.stallId
      });
      
      await loadUsersByRole();
      setError(null);
      return true; // Success
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
      return false; // Failure
    } finally {
      setLoading(false);
    }
  };

  // Utility function
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return {
    // State
    loading,
    error,
    stats,
    stalls,
    users,
    admins,
    stallOwners,
    
    // Actions
    loadData,
    handleDeleteStall,
    handleUpdateStall,
    handleDeleteUser,
    handleChangeUserRole,
    handleCreateUser,
    formatDateTime,
    
    // Setters for error handling
    setError
  };
} 