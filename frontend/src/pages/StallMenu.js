import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import stallsData from '../data/stalls.json';
import menuData from '../data/menu.json';
import MenuItemCard from '../components/MenuItemCard';

function StallMenu() {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Meals');

  const stall = stallsData.find(s => s.id === stallId);
  const stallMenuItems = menuData.filter(item => item.stallId === stallId);
  
  const categories = [...new Set(stallMenuItems.map(item => item.category))];
  const filteredItems = stallMenuItems.filter(item => item.category === activeCategory);

  if (!stall) {
    return <div>Stall not found</div>;
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
          <span>{stall.cuisine}</span>
          <span>•</span>
          <div className="flex items-center">
            <span className="text-yellow-500">⭐</span>
            <span className="ml-1">{stall.rating}</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {filteredItems.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default StallMenu; 