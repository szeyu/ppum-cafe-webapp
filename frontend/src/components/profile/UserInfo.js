import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

function UserInfo({ user }) {
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="card text-center">
      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">
              {t('profile.userInfo.role') || 'Role'}
            </span>
            <p className="font-medium text-gray-800 capitalize">{user.role}</p>
          </div>
          <div>
            <span className="text-gray-500">
              {t('profile.userInfo.language') || 'Language'}
            </span>
            <p className="font-medium text-gray-800">
              {currentLanguage === 'BM' ? 'Bahasa Malaysia' : 'English'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo; 