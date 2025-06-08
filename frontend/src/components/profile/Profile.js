import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { BottomNav } from '../shared';

// Import profile components
import UserInfo from './UserInfo';
import OrderHistory from './OrderHistory';
import UserPreferences from './UserPreferences';
import LogoutSection from './LogoutSection';

function Profile() {
  const { state, dispatch, logout, updateLanguage } = useApp();
  const { t } = useTranslation();

  const handleLanguageChange = async (language) => {
    try {
      // Update language in backend and state
      await updateLanguage(language);
      
      // Also update local state for immediate UI update
      dispatch({ type: 'SET_LANGUAGE', payload: language });
      
      // Show success message
      const message = language === 'BM' 
        ? 'Bahasa telah ditukar kepada Bahasa Malaysia' 
        : 'Language has been changed to English';
      
      // You could show a toast notification here
      console.log(message);
    } catch (error) {
      console.error('Error updating language:', error);
      // Show error message
      const errorMessage = state.language === 'BM'
        ? 'Ralat semasa menukar bahasa'
        : 'Error changing language';
      console.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    const confirmMessage = t('profile.logout.confirm') || 'Are you sure you want to logout?';
    if (window.confirm(confirmMessage)) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <h1 className="text-xl font-bold text-center">
          {t('profile.title') || 'My Profile'}
        </h1>
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