import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import stallsData from '../data/stalls.json';
import BottomNav from '../components/BottomNav';

function Home() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStalls = stallsData.filter(stall =>
    stall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stall.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stalls Grid */}
      <div className="px-4 space-y-4">
        {filteredStalls.map(stall => (
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
                <p className="text-gray-600 text-sm">{stall.cuisine}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm text-gray-600 ml-1">{stall.rating}</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">Best Seller: {stall.bestSeller}</p>
              </div>
              
              <button className="btn-primary text-sm px-4 py-2">
                ORDER
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Floating Button */}
      {cartItemCount > 0 && (
        <button
          onClick={() => navigate('/cart')}
          className="fixed bottom-24 right-4 bg-primary-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          </div>
        </button>
      )}

      <BottomNav />
    </div>
  );
}

export default Home; 