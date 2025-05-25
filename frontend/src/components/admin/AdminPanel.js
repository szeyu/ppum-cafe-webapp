import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import ApiService from '../../services/api';
import { BottomNav } from '../shared';

function AdminPanel() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dashboard data
  const [stats, setStats] = useState({});
  
  // Stalls data
  const [stalls, setStalls] = useState([]);
  const [editingStall, setEditingStall] = useState(null);
  
  // Menu items data
  const [menuItems, setMenuItems] = useState([]);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  
  // Orders data
  const [orders, setOrders] = useState([]);
  
  // Users data
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [stallOwners, setStallOwners] = useState([]);

  // User management states
  const [activeUserTab, setActiveUserTab] = useState('users');
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [roleChangeData, setRoleChangeData] = useState({ email: '', newRole: 'user', stallId: null });
  const [createUserData, setCreateUserData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: 'admin', 
    stallId: null 
  });

  useEffect(() => {
    if (state.user && state.user.role === 'admin') {
      loadData();
    }
  }, [state.user, activeTab]);

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
      if (editingStall.id) {
        // Update existing stall
        await ApiService.updateStall(editingStall.id, stallData);
        alert('Stall updated successfully!');
      } else {
        // Create new stall
        await ApiService.createStall(stallData);
        alert('Stall created successfully!');
      }
      setEditingStall(null);
      loadData();
    } catch (err) {
      alert('Error saving stall: ' + err.message);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }
    
    try {
      await ApiService.deleteMenuItem(itemId);
      setMenuItems(menuItems.filter(item => item.id !== itemId));
      alert('Menu item deleted successfully!');
    } catch (err) {
      alert('Error deleting menu item: ' + err.message);
    }
  };

  const handleUpdateMenuItem = async (itemData) => {
    try {
      if (editingMenuItem.id) {
        // Update existing menu item
        await ApiService.updateMenuItem(editingMenuItem.id, itemData);
        alert('Menu item updated successfully!');
      } else {
        // Create new menu item
        await ApiService.createMenuItem(itemData);
        alert('Menu item created successfully!');
      }
      setEditingMenuItem(null);
      loadData();
    } catch (err) {
      alert('Error saving menu item: ' + err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }
    
    try {
      await ApiService.deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
      alert('Order deleted successfully!');
    } catch (err) {
      alert('Error deleting order: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will delete all their orders and data.')) {
      return;
    }
    
    try {
      await ApiService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleChangeUserRole = async () => {
    try {
      setLoading(true);
      await ApiService.changeUserRole(roleChangeData.email, roleChangeData.newRole, roleChangeData.stallId);
      setShowRoleChangeModal(false);
      setRoleChangeData({ email: '', newRole: 'user', stallId: null });
      await loadUsersByRole();
      setError(null);
    } catch (error) {
      console.error('Error changing user role:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (createUserData.password !== createUserData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      setLoading(true);
      await ApiService.createUserByAdmin({
        name: createUserData.name,
        email: createUserData.email,
        password: createUserData.password,
        role: createUserData.role,
        stall_id: createUserData.stallId
      });
      
      setShowCreateUserModal(false);
      setCreateUserData({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        role: 'admin', 
        stallId: null 
      });
      await loadUsersByRole();
      setError(null);
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'stalls', name: 'Stalls', icon: '🏪' },
    { id: 'users', name: 'Users', icon: '👥' },
  ];

  if (!state.user || state.user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need to be an admin to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">PPUM Café Admin Panel</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 whitespace-nowrap font-medium flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
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
            )}

            {/* Stalls Tab */}
            {activeTab === 'stalls' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Stalls</h2>
                  <button
                    onClick={() => setEditingStall({ id: null, name: '', cuisine_type: '', description: '', rating: 0, image_url: '', is_active: true })}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Add New Stall
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuisine Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stalls.map(stall => (
                        <tr key={stall.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{stall.name}</div>
                            <div className="text-sm text-gray-500">{stall.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {stall.cuisine_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ⭐ {stall.rating}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              stall.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {stall.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => setEditingStall(stall)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStall(stall.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab - Completely Revamped */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => setShowRoleChangeModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Change User Role
                    </button>
                    <button
                      onClick={() => setShowCreateUserModal(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Create Admin/Stall Owner
                    </button>
                  </div>
                </div>

                {/* User Role Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveUserTab('users')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeUserTab === 'users'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Regular Users ({users.length})
                    </button>
                    <button
                      onClick={() => setActiveUserTab('stall-owners')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeUserTab === 'stall-owners'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Stall Owners ({stallOwners.length})
                    </button>
                    <button
                      onClick={() => setActiveUserTab('admins')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeUserTab === 'admins'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Admins ({admins.length})
                    </button>
                  </nav>
                </div>

                {/* Regular Users */}
                {activeUserTab === 'users' && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Regular Users</h3>
                      <p className="text-sm text-gray-500">Customers who can browse and order food</p>
                    </div>
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.phone || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDateTime(user.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button
                                onClick={() => {
                                  setRoleChangeData({ email: user.email, newRole: 'stall_owner', stallId: null });
                                  setShowRoleChangeModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Promote to Stall Owner
                              </button>
                              <button
                                onClick={() => {
                                  setRoleChangeData({ email: user.email, newRole: 'admin', stallId: null });
                                  setShowRoleChangeModal(true);
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                Promote to Admin
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Stall Owners */}
                {activeUserTab === 'stall-owners' && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Stall Owners</h3>
                      <p className="text-sm text-gray-500">Users who manage individual food stalls</p>
                    </div>
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stall</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {stallOwners.map(user => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.managed_stall?.name || 'No Stall Assigned'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.phone || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button
                                onClick={() => {
                                  setRoleChangeData({ email: user.email, newRole: 'admin', stallId: null });
                                  setShowRoleChangeModal(true);
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                Promote to Admin
                              </button>
                              <button
                                onClick={() => {
                                  setRoleChangeData({ email: user.email, newRole: 'user', stallId: null });
                                  setShowRoleChangeModal(true);
                                }}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                Demote to User
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Admins */}
                {activeUserTab === 'admins' && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">System Administrators</h3>
                      <p className="text-sm text-gray-500">Users with full system access and management capabilities</p>
                    </div>
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {admins.map(user => (
                          <tr key={user.id} className={user.id === state.user?.id ? 'bg-blue-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {user.name}
                              {user.id === state.user?.id && (
                                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  You
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.phone || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.last_login ? formatDateTime(user.last_login) : 'Never'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              {user.id !== state.user?.id && (
                                <>
                                  <button
                                    onClick={() => {
                                      setRoleChangeData({ email: user.email, newRole: 'user', stallId: null });
                                      setShowRoleChangeModal(true);
                                    }}
                                    className="text-yellow-600 hover:text-yellow-900"
                                  >
                                    Demote to User
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                              {user.id === state.user?.id && (
                                <span className="text-gray-500 text-sm">Current User</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Change User Role</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
                  <input
                    type="email"
                    value={roleChangeData.email}
                    onChange={(e) => setRoleChangeData({...roleChangeData, email: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter user email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Role</label>
                  <select
                    value={roleChangeData.newRole}
                    onChange={(e) => setRoleChangeData({...roleChangeData, newRole: e.target.value, stallId: null})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="user">Regular User</option>
                    <option value="stall_owner">Stall Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                {roleChangeData.newRole === 'stall_owner' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign Stall</label>
                    <select
                      value={roleChangeData.stallId || ''}
                      onChange={(e) => setRoleChangeData({...roleChangeData, stallId: parseInt(e.target.value)})}
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Select a stall</option>
                      {stalls.map(stall => (
                        <option key={stall.id} value={stall.id}>{stall.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 pt-6">
                <button
                  onClick={handleChangeUserRole}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Role'}
                </button>
                <button
                  onClick={() => setShowRoleChangeModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Create Admin/Stall Owner</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={createUserData.name}
                    onChange={(e) => setCreateUserData({...createUserData, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={createUserData.email}
                    onChange={(e) => setCreateUserData({...createUserData, email: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={createUserData.password}
                    onChange={(e) => setCreateUserData({...createUserData, password: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={createUserData.confirmPassword}
                    onChange={(e) => setCreateUserData({...createUserData, confirmPassword: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={createUserData.role}
                    onChange={(e) => setCreateUserData({...createUserData, role: e.target.value, stallId: null})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="admin">Admin</option>
                    <option value="stall_owner">Stall Owner</option>
                  </select>
                </div>
                
                {createUserData.role === 'stall_owner' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign Stall</label>
                    <select
                      value={createUserData.stallId || ''}
                      onChange={(e) => setCreateUserData({...createUserData, stallId: parseInt(e.target.value)})}
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Select a stall</option>
                      {stalls.map(stall => (
                        <option key={stall.id} value={stall.id}>{stall.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 pt-6">
                <button
                  onClick={handleCreateUser}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
                <button
                  onClick={() => setShowCreateUserModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Stall Modal */}
      {editingStall && (
        <StallEditModal
          stall={editingStall}
          onSave={handleUpdateStall}
          onCancel={() => setEditingStall(null)}
        />
      )}

      {/* Edit Menu Item Modal */}
      {editingMenuItem && (
        <MenuItemEditModal
          item={editingMenuItem}
          stalls={stalls}
          onSave={handleUpdateMenuItem}
          onCancel={() => setEditingMenuItem(null)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

// Stall Edit Modal Component
function StallEditModal({ stall, onSave, onCancel }) {
  const [formData, setFormData] = useState(stall);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {stall.id ? 'Edit Stall' : 'Add New Stall'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
              <input
                type="text"
                value={formData.cuisine_type}
                onChange={(e) => setFormData({...formData, cuisine_type: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
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

// Menu Item Edit Modal Component
function MenuItemEditModal({ item, stalls, onSave, onCancel }) {
  const [formData, setFormData] = useState(item);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {item.id ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Stall</label>
                <select
                  value={formData.stall_id}
                  onChange={(e) => setFormData({...formData, stall_id: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  {stalls.map(stall => (
                    <option key={stall.id} value={stall.id}>{stall.name}</option>
                  ))}
                </select>
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
            
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value)})}
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
                  onChange={(e) => setFormData({...formData, protein: parseFloat(e.target.value)})}
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
                  onChange={(e) => setFormData({...formData, carbs: parseFloat(e.target.value)})}
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
                  onChange={(e) => setFormData({...formData, fat: parseFloat(e.target.value)})}
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
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
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

export default AdminPanel; 