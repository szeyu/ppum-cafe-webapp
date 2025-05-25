import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ApiService from '../services/api';
import { 
  MenuItemCard, 
  PageHeader, 
  LoadingSpinner, 
  ErrorMessage, 
  TabNavigation, 
  EmptyState 
} from '../components';

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
    return <LoadingSpinner message="Loading menu..." fullScreen />;
  }

  // Show error state
  if (error || !stall) {
    return (
      <ErrorMessage
        title="Stall Not Found"
        message={error || 'The requested stall could not be found.'}
        onRetry={() => navigate('/home')}
        retryText="Back to Home"
        fullScreen
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader title={stall.name} />

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
      <TabNavigation
        tabs={categories}
        activeTab={activeCategory}
        onTabChange={handleCategoryChange}
      />

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {state.loading ? (
          <LoadingSpinner message="Loading menu items..." size="medium" />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No items found"
            message="This category doesn't have any items yet."
          />
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