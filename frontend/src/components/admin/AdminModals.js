import React, { useState } from 'react';

// Role Change Modal
export function RoleChangeModal({ 
  show, 
  onClose, 
  roleChangeData, 
  setRoleChangeData, 
  onSubmit, 
  loading, 
  stalls 
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Change User Role</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
              <input
                type="email"
                value={roleChangeData.email}
                onChange={(e) => setRoleChangeData({...roleChangeData, email: e.target.value})}
                className="w-full p-3 border rounded-lg text-sm"
                placeholder="Enter user email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Role</label>
              <select
                value={roleChangeData.newRole}
                onChange={(e) => setRoleChangeData({...roleChangeData, newRole: e.target.value, stallId: null})}
                className="w-full p-3 border rounded-lg text-sm"
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
                  className="w-full p-3 border rounded-lg text-sm"
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
          
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? 'Changing...' : 'Change Role'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create User Modal
export function CreateUserModal({ 
  show, 
  onClose, 
  createUserData, 
  setCreateUserData, 
  onSubmit, 
  loading, 
  stalls 
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Create Admin/Stall Owner</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={createUserData.name}
                onChange={(e) => setCreateUserData({...createUserData, name: e.target.value})}
                className="w-full p-3 border rounded-lg text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={createUserData.email}
                onChange={(e) => setCreateUserData({...createUserData, email: e.target.value})}
                className="w-full p-3 border rounded-lg text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={createUserData.password}
                onChange={(e) => setCreateUserData({...createUserData, password: e.target.value})}
                className="w-full p-3 border rounded-lg text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={createUserData.confirmPassword}
                onChange={(e) => setCreateUserData({...createUserData, confirmPassword: e.target.value})}
                className="w-full p-3 border rounded-lg text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={createUserData.role}
                onChange={(e) => setCreateUserData({...createUserData, role: e.target.value, stallId: null})}
                className="w-full p-3 border rounded-lg text-sm"
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
                  className="w-full p-3 border rounded-lg text-sm"
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
          
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stall Edit Modal
export function StallEditModal({ stall, onSave, onCancel }) {
  const [formData, setFormData] = useState(stall);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!stall) return null;

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
                className="w-full p-3 border rounded-lg text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
              <input
                type="text"
                value={formData.cuisine_type}
                onChange={(e) => setFormData({...formData, cuisine_type: e.target.value})}
                className="w-full p-3 border rounded-lg text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border rounded-lg text-sm"
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
                className="w-full p-3 border rounded-lg text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full p-3 border rounded-lg text-sm"
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
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 text-sm font-medium"
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

// Menu Item Edit Modal
export function MenuItemEditModal({ item, stalls, onSave, onCancel }) {
  const [formData, setFormData] = useState(item);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {item.id ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border rounded-lg text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stall</label>
                <select
                  value={formData.stall_id}
                  onChange={(e) => setFormData({...formData, stall_id: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg text-sm"
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
                className="w-full p-3 border rounded-lg text-sm"
                rows="3"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full p-3 border rounded-lg text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 border rounded-lg text-sm"
                  required
                >
                  <option value="Meals">Meals</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg text-sm"
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
                  className="w-full p-3 border rounded-lg text-sm"
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
                  className="w-full p-3 border rounded-lg text-sm"
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
                  className="w-full p-3 border rounded-lg text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergens (comma-separated)</label>
              <input
                type="text"
                value={formData.allergens ? formData.allergens.join(', ') : ''}
                onChange={(e) => setFormData({...formData, allergens: e.target.value.split(',').map(a => a.trim()).filter(a => a)})}
                className="w-full p-3 border rounded-lg text-sm"
                placeholder="e.g., nuts, dairy, gluten"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
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
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 text-sm font-medium"
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