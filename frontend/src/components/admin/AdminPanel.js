import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomNav } from '../shared';
import { useAdminData } from '../../hooks/useAdminData';

// Import new components
import AdminDashboard from './AdminDashboard';
import AdminStalls from './AdminStalls';
import AdminUsers from './AdminUsers';
import { 
  RoleChangeModal, 
  CreateUserModal, 
  StallEditModal, 
  MenuItemEditModal 
} from './AdminModals';

function AdminPanel() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeUserTab, setActiveUserTab] = useState('users');
  
  // Modal states
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [editingStall, setEditingStall] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  
  // Form data states
  const [roleChangeData, setRoleChangeData] = useState({ 
    email: '', 
    newRole: 'user', 
    stallId: null 
  });
  const [createUserData, setCreateUserData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: 'admin', 
    stallId: null 
  });

  // Use custom hook for data management
  const {
    loading,
    error,
    stats,
    stalls,
    users,
    admins,
    stallOwners,
    handleDeleteStall,
    handleUpdateStall,
    handleDeleteUser,
    handleChangeUserRole,
    handleCreateUser,
    formatDateTime,
    setError
  } = useAdminData(activeTab, state.user);

  // Modal handlers
  const handleShowRoleChangeModal = (data = null) => {
    if (data) {
      setRoleChangeData(data);
    }
    setShowRoleChangeModal(true);
  };

  const handleRoleChangeSubmit = async () => {
    const success = await handleChangeUserRole(roleChangeData);
    if (success) {
      setShowRoleChangeModal(false);
      setRoleChangeData({ email: '', newRole: 'user', stallId: null });
    }
  };

  const handleCreateUserSubmit = async () => {
    const success = await handleCreateUser(createUserData);
    if (success) {
      setShowCreateUserModal(false);
      setCreateUserData({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        role: 'admin', 
        stallId: null 
      });
    }
  };

  const handleStallSave = async (stallData) => {
    await handleUpdateStall(stallData);
    setEditingStall(null);
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'stalls', name: 'Stalls', icon: '🏪' },
    { id: 'users', name: 'Users', icon: '👥' },
  ];

  // Access control
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
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        {/* Content Tabs */}
        {!loading && !error && (
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboard 
                stats={stats} 
                formatDateTime={formatDateTime} 
              />
            )}

            {activeTab === 'stalls' && (
              <AdminStalls
                stalls={stalls}
                onEditStall={setEditingStall}
                onDeleteStall={handleDeleteStall}
              />
            )}

            {activeTab === 'users' && (
              <AdminUsers
                users={users}
                admins={admins}
                stallOwners={stallOwners}
                activeUserTab={activeUserTab}
                setActiveUserTab={setActiveUserTab}
                onShowRoleChangeModal={handleShowRoleChangeModal}
                onShowCreateUserModal={() => setShowCreateUserModal(true)}
                onDeleteUser={handleDeleteUser}
                formatDateTime={formatDateTime}
                currentUserId={state.user?.id}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <RoleChangeModal
        show={showRoleChangeModal}
        onClose={() => setShowRoleChangeModal(false)}
        roleChangeData={roleChangeData}
        setRoleChangeData={setRoleChangeData}
        onSubmit={handleRoleChangeSubmit}
        loading={loading}
        stalls={stalls}
      />

      <CreateUserModal
        show={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        createUserData={createUserData}
        setCreateUserData={setCreateUserData}
        onSubmit={handleCreateUserSubmit}
        loading={loading}
        stalls={stalls}
      />

      <StallEditModal
        stall={editingStall}
        onSave={handleStallSave}
        onCancel={() => setEditingStall(null)}
      />

      <MenuItemEditModal
        item={editingMenuItem}
        stalls={stalls}
        onSave={(itemData) => {
          // Handle menu item save logic here if needed
          setEditingMenuItem(null);
        }}
        onCancel={() => setEditingMenuItem(null)}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default AdminPanel; 