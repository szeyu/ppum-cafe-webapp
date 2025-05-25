import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ApiService from '../services/api';
import { MenuItemCard } from '../components';

function StallMenu() {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const { state, loadMenuItems } = useApp();
  const [activeCategory, setActiveCategory] = useState('Meals');
  const [stall, setStall] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize the loadStallData function to prevent infinite loops
  const loadStallData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      // Load stall details
      const stallData = await ApiService.getStall(parseInt(stallId));
      setStall(stallData);
      
      // Load categories
      const categoriesData = await ApiService.getMenuCategories(parseInt(stallId));
      setCategories(categoriesData?.categories || []); // Handle case where API returns null/undefined
      
      // Load initial menu items
      if (categoriesData?.categories && categoriesData.categories.length > 0) {
        const initialCategory = categoriesData.categories.includes('Meals') ? 'Meals' : categoriesData.categories[0];
        setActiveCategory(initialCategory);
      } else {
        setActiveCategory('Meals'); // Set a default even if no categories
      }
      
    } catch (err) {
      console.error('Error loading stall data:', err);
      setError(err.message);
      setCategories([]); // Ensure categories is always an array even on error
    } finally {
      setLoading(false);
    }
  }, [stallId]); // Only depend on stallId

  useEffect(() => {
    loadStallData();
  }, [loadStallData]);

  useEffect(() => {
    if (Array.isArray(categories) && categories.length > 0 && !categories.includes(activeCategory)) {
      const newCategory = categories[0];
      if (newCategory !== activeCategory) {
        setActiveCategory(newCategory);
      }
    }
  }, [categories]); // Removed activeCategory from dependencies to prevent loops

  // Fix the infinite loop by removing loadMenuItems from dependencies
  useEffect(() => {
    if (activeCategory && stallId) {
      loadMenuItems(parseInt(stallId), activeCategory);
    }
  }, [activeCategory, stallId]); // Removed loadMenuItems from dependencies

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const filteredItems = (state.menuItems || []).filter(item => item.category === activeCategory);

  // Show loading state during initial data fetch
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !stall) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Stall Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested stall could not be found.'}</p>
          <button 
            onClick={() => navigate('/home')} 
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{stall.name}</h1>
        </div>
      </div>

      {/* Stall Info */}
      <div className="p-4 bg-white border-b">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{stall.cuisine_type}</span>
          <span>•</span>
          <div className="flex items-center">
            <span className="text-yellow-500">⭐</span>
            <span className="ml-1">{stall.rating}</span>
          </div>
        </div>
        {stall.description && (
          <p className="text-gray-600 text-sm mt-2">{stall.description}</p>
        )}
      </div>

      {/* Category Tabs */}
      {Array.isArray(categories) && categories.length > 0 && (
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
                onClick={() => handleCategoryChange(category)}
              className={`px-6 py-3 whitespace-nowrap font-medium ${
                activeCategory === category
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {state.loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No items found</h2>
            <p className="text-gray-600">This category doesn't have any items yet.</p>
          </div>
        ) : (
          filteredItems.map(item => (
          <MenuItemCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

export default StallMenu; 