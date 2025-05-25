import React from 'react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components';

function Profile() {
  const { state, dispatch, logout } = useApp();

  const handleLanguageChange = (language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <h1 className="text-xl font-bold text-center">My Profile</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info */}
        <div className="card text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{state.user.name}</h2>
          <p className="text-gray-600">{state.user.email}</p>
        </div>

        {/* My Orders */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">My Orders</h3>
          
          {state.orders.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {state.orders.slice(0, 2).map(order => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order {order.id} • Yesterday, 12:45 PM</p>
                    <p className="text-sm text-gray-600">
                      Malay Delights: Nasi Lemak (x1)
                    </p>
                    <p className="text-sm text-gray-600">
                      Western Corner: Grilled Chicken (x1)
                    </p>
                  </div>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm">
                    Reorder
                  </button>
                </div>
              ))}
              
              {state.orders.length > 2 && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #1198 • 3 days ago, 6:30 PM</p>
                    <p className="text-sm text-gray-600">
                      Malay Delights: Rendang Ayam (x1)
                    </p>
                  </div>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm">
                    Reorder
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Language</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleLanguageChange('English')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    state.language === 'English'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('BM')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    state.language === 'BM'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  BM
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="card">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default Profile; 