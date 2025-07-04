import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

function MenuItemModal({ item, onSave, onCancel, title }) {
  const [formData, setFormData] = useState(item);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('english');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          
          {/* Language Tabs */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab('english')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'english'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveTab('bm')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'bm'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bahasa Malaysia
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'english' ? (
              <>
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
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (BM)</label>
                  <input
                    type="text"
                    value={formData.name_bm || ''}
                    onChange={(e) => setFormData({...formData, name_bm: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Nama dalam Bahasa Malaysia"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (BM)</label>
                  <textarea
                    value={formData.description_bm || ''}
                    onChange={(e) => setFormData({...formData, description_bm: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    placeholder="Penerangan dalam Bahasa Malaysia"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category (BM)</label>
                  <input
                    type="text"
                    value={formData.category_bm || ''}
                    onChange={(e) => setFormData({...formData, category_bm: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Kategori dalam Bahasa Malaysia"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergens (BM, comma-separated)</label>
                  <input
                    type="text"
                    value={formData.allergens_bm ? formData.allergens_bm.join(', ') : ''}
                    onChange={(e) => setFormData({...formData, allergens_bm: e.target.value.split(',').map(a => a.trim()).filter(a => a)})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="cth., kacang, tenusu, gluten"
                  />
                </div>
                
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Please provide translations for your menu item to make it accessible to Bahasa Malaysia speakers.
                  </p>
                </div>
              </>
            )}
            
            <div className="flex items-center space-x-4 pt-4 border-t">
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

export default MenuItemModal; 