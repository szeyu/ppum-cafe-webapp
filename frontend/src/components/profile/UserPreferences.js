import React from 'react';

function UserPreferences({ language, onLanguageChange }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">Preferences</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Language</span>
          <div className="flex space-x-2">
            <button
              onClick={() => onLanguageChange('English')}
              className={`px-3 py-1 rounded-full text-sm ${
                language === 'English'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('BM')}
              className={`px-3 py-1 rounded-full text-sm ${
                language === 'BM'
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
  );
}

export default UserPreferences; 