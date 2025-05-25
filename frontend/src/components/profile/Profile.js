import React from 'react';
import { useApp } from '../../context/AppContext';
import { BottomNav } from '../shared';

// Import profile components
import UserInfo from './UserInfo';
import OrderHistory from './OrderHistory';
import UserPreferences from './UserPreferences';
import LogoutSection from './LogoutSection';

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
        <UserInfo user={state.user} />

        {/* Order History */}
        <OrderHistory orders={state.orders} />

        {/* User Preferences */}
        <UserPreferences 
          language={state.language} 
          onLanguageChange={handleLanguageChange} 
        />

        {/* Logout Section */}
        <LogoutSection onLogout={handleLogout} />
      </div>

      <BottomNav />
    </div>
  );
}

export default Profile; 