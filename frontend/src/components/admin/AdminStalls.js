import React from 'react';

function AdminStalls({ stalls, onEditStall, onDeleteStall, onAddMenuItem }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Stalls</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onAddMenuItem}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium w-full sm:w-auto"
          >
            Add Menu Item
          </button>
          <button
            onClick={() => onEditStall({
              id: null,
              name: '',
              name_bm: '',
              cuisine_type: '',
              cuisine_type_bm: '',
              description: '',
              description_bm: '',
              rating: 0,
              image_url: '',
              is_active: true
            })}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium w-full sm:w-auto"
          >
            Add New Stall
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuisine Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stalls.map(stall => (
                <tr key={stall.id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{stall.name}</div>
                    {stall.name_bm && (
                      <div className="text-xs text-gray-500">BM: {stall.name_bm}</div>
                    )}
                    <div className="text-sm text-gray-500 max-w-xs truncate">{stall.description}</div>
                    {stall.description_bm && (
                      <div className="text-xs text-gray-400 max-w-xs truncate">BM: {stall.description_bm}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stall.cuisine_type}
                    {stall.cuisine_type_bm && (
                      <div className="text-xs text-gray-500">BM: {stall.cuisine_type_bm}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ⭐ {stall.rating}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      stall.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {stall.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => onEditStall(stall)}
                        className="text-blue-600 hover:text-blue-900 text-left"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteStall(stall.id)}
                        className="text-red-600 hover:text-red-900 text-left"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminStalls; 