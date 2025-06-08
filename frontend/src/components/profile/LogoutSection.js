import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

function LogoutSection({ onLogout }) {
  const { t } = useTranslation();

  return (
    <div className="card">
      <button
        onClick={onLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
        </svg>
        <span>{t('profile.logout.button') || 'Logout'}</span>
      </button>
    </div>
  );
}

export default LogoutSection;
