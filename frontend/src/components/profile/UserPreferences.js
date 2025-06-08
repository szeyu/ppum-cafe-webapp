import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

function UserPreferences({ language, onLanguageChange }) {
  const { t, currentLanguage } = useTranslation();

  // Use currentLanguage from the translation hook for consistency
  const activeLanguage = currentLanguage || language || 'English';

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">
        {t('profile.preferences.title') || 'Preferences'}
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">
            {t('profile.preferences.language') || 'Language'}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onLanguageChange('English')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeLanguage === 'English'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('common.english') || 'English'}
            </button>
            <button
              onClick={() => onLanguageChange('BM')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeLanguage === 'BM'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('common.bahasaMalaysia') || 'Bahasa Malaysia'}
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700">
            {t('profile.preferences.notifications') || 'Notifications'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default UserPreferences; 