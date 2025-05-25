import React from 'react';

function UserTable({ 
  title, 
  description, 
  users, 
  type, 
  onShowRoleChangeModal, 
  onDeleteUser, 
  formatDateTime, 
  currentUserId 
}) {
  const renderActions = (user) => {
    if (type === 'regular') {
      return (
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onShowRoleChangeModal({ email: user.email, newRole: 'stall_owner', stallId: null })}
            className="text-blue-600 hover:text-blue-900 text-left text-xs"
          >
            → Stall Owner
          </button>
          <button
            onClick={() => onShowRoleChangeModal({ email: user.email, newRole: 'admin', stallId: null })}
            className="text-green-600 hover:text-green-900 text-left text-xs"
          >
            → Admin
          </button>
          <button
            onClick={() => onDeleteUser(user.id)}
            className="text-red-600 hover:text-red-900 text-left text-xs"
          >
            Delete
          </button>
        </div>
      );
    }

    if (type === 'stall_owner') {
      return (
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onShowRoleChangeModal({ email: user.email, newRole: 'admin', stallId: null })}
            className="text-green-600 hover:text-green-900 text-left text-xs"
          >
            → Admin
          </button>
          <button
            onClick={() => onShowRoleChangeModal({ email: user.email, newRole: 'user', stallId: null })}
            className="text-yellow-600 hover:text-yellow-900 text-left text-xs"
          >
            → User
          </button>
          <button
            onClick={() => onDeleteUser(user.id)}
            className="text-red-600 hover:text-red-900 text-left text-xs"
          >
            Delete
          </button>
        </div>
      );
    }

    if (type === 'admin') {
      if (user.id === currentUserId) {
        return <span className="text-gray-500 text-xs">Current User</span>;
      }
      return (
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onShowRoleChangeModal({ email: user.email, newRole: 'user', stallId: null })}
            className="text-yellow-600 hover:text-yellow-900 text-left text-xs"
          >
            → User
          </button>
          <button
            onClick={() => onDeleteUser(user.id)}
            className="text-red-600 hover:text-red-900 text-left text-xs"
          >
            Delete
          </button>
        </div>
      );
    }
  };

  const renderTableHeaders = () => {
    const baseHeaders = ['Name', 'Email'];
    
    if (type === 'stall_owner') {
      return [...baseHeaders, 'Stall', 'Phone', 'Actions'];
    }
    
    if (type === 'admin') {
      return [...baseHeaders, 'Phone', 'Last Login', 'Actions'];
    }
    
    return [...baseHeaders, 'Phone', 'Joined', 'Actions'];
  };

  const renderTableRow = (user) => {
    const baseColumns = [
      <td key="name" className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
        {user.name}
        {user.id === currentUserId && type === 'admin' && (
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            You
          </span>
        )}
      </td>,
      <td key="email" className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="max-w-xs truncate">{user.email}</div>
      </td>
    ];

    if (type === 'stall_owner') {
      return [
        ...baseColumns,
        <td key="stall" className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="max-w-xs truncate">{user.managed_stall?.name || 'No Stall Assigned'}</div>
        </td>,
        <td key="phone" className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          {user.phone || 'N/A'}
        </td>,
        <td key="actions" className="px-4 py-4 whitespace-nowrap text-sm">
          {renderActions(user)}
        </td>
      ];
    }

    if (type === 'admin') {
      return [
        ...baseColumns,
        <td key="phone" className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          {user.phone || 'N/A'}
        </td>,
        <td key="lastLogin" className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="max-w-xs truncate">{user.last_login ? formatDateTime(user.last_login) : 'Never'}</div>
        </td>,
        <td key="actions" className="px-4 py-4 whitespace-nowrap text-sm">
          {renderActions(user)}
        </td>
      ];
    }

    return [
      ...baseColumns,
      <td key="phone" className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.phone || 'N/A'}
      </td>,
      <td key="joined" className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="max-w-xs truncate">{formatDateTime(user.created_at)}</div>
      </td>,
      <td key="actions" className="px-4 py-4 whitespace-nowrap text-sm">
        {renderActions(user)}
      </td>
    ];
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {renderTableHeaders().map(header => (
                <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className={user.id === currentUserId && type === 'admin' ? 'bg-blue-50' : ''}>
                {renderTableRow(user)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable; 