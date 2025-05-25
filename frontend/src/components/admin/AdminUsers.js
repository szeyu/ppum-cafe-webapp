import React from 'react';
import UserTable from './UserTable';

function AdminUsers({ 
  users, 
  admins, 
  stallOwners, 
  activeUserTab, 
  setActiveUserTab,
  onShowRoleChangeModal,
  onShowCreateUserModal,
  onDeleteUser,
  formatDateTime,
  currentUserId
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onShowRoleChangeModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Change User Role
          </button>
          <button
            onClick={onShowCreateUserModal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            Create Admin/Stall Owner
          </button>
        </div>
      </div>

      {/* User Role Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveUserTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeUserTab === 'users'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Regular Users ({users.length})
          </button>
          <button
            onClick={() => setActiveUserTab('stall-owners')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeUserTab === 'stall-owners'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Stall Owners ({stallOwners.length})
          </button>
          <button
            onClick={() => setActiveUserTab('admins')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
        <UserTable
          title="Regular Users"
          description="Customers who can browse and order food"
          users={users}
          type="regular"
          onShowRoleChangeModal={onShowRoleChangeModal}
          onDeleteUser={onDeleteUser}
          formatDateTime={formatDateTime}
          currentUserId={currentUserId}
        />
      )}

      {/* Stall Owners */}
      {activeUserTab === 'stall-owners' && (
        <UserTable
          title="Stall Owners"
          description="Users who manage individual food stalls"
          users={stallOwners}
          type="stall_owner"
          onShowRoleChangeModal={onShowRoleChangeModal}
          onDeleteUser={onDeleteUser}
          formatDateTime={formatDateTime}
          currentUserId={currentUserId}
        />
      )}

      {/* Admins */}
      {activeUserTab === 'admins' && (
        <UserTable
          title="System Administrators"
          description="Users with full system access and management capabilities"
          users={admins}
          type="admin"
          onShowRoleChangeModal={onShowRoleChangeModal}
          onDeleteUser={onDeleteUser}
          formatDateTime={formatDateTime}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}

export default AdminUsers; 