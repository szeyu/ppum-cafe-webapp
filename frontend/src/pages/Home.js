import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components';

function Home() {
  const navigate = useNavigate();
  const { state, searchStalls } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (value) => {
    setSearchTerm(value);
    await searchStalls(value);
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stalls...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <h1 className="text-xl font-bold text-center">PPUM CAFÉ</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search stalls or menu items..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="input-field pl-10"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stalls Grid */}
      <div className="px-4 space-y-4">
        {state.stalls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No stalls found</h2>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        ) : (
          state.stalls.map(stall => (
            <div
              key={stall.id}
              onClick={() => navigate(`/stall/${stall.id}`)}
              className="card cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{stall.name}</h3>
                  <p className="text-gray-600 text-sm">{stall.cuisine_type}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm text-gray-600 ml-1">{stall.rating}</span>
                  </div>
                  {stall.best_seller && (
                    <p className="text-xs text-orange-600 mt-1">Best Seller: {stall.best_seller}</p>
                  )}
                </div>
                
                <button className="btn-primary text-sm px-4 py-2">
                  ORDER
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default Home; 