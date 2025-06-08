import React from 'react';

function StallMenuItems({ 
  menuItems, 
  onAddNewItem, 
  onEditItem, 
  onDeleteItem 
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
        <button
          onClick={onAddNewItem}
          className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
        >
          Add New Item
        </button>
      </div>

      {menuItems.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first menu item.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {menuItems.map((item) => (
              <li key={item.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        {item.name_bm && (
                          <p className="text-xs text-gray-500">
                            BM: {item.name_bm}
                          </p>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </span>
                        {item.is_best_seller && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            Best Seller
                          </span>
                        )}
                        {item.is_hospital_friendly && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Hospital Friendly
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                      {item.description_bm && (
                        <p className="text-xs text-gray-500">
                          BM: {item.description_bm}
                        </p>
                      )}
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>RM {item.price.toFixed(2)}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                        {item.category_bm && (
                          <>
                            <span className="text-xs">({item.category_bm})</span>
                          </>
                        )}
                        {item.calories && (
                          <>
                            <span>•</span>
                            <span>{item.calories} cal</span>
                          </>
                        )}
                      </div>
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-red-600">
                            Allergens: {item.allergens.join(', ')}
                          </span>
                        </div>
                      )}
                      {item.allergens_bm && item.allergens_bm.length > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-red-600">
                            Allergens (BM): {item.allergens_bm.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Translation Status */}
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.name_bm && item.description_bm
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.name_bm && item.description_bm
                          ? 'Fully Translated'
                          : 'Translation Incomplete'}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => onEditItem(item)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StallMenuItems; 