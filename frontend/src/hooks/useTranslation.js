import { useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import enTranslations from '../data/translations/en.json';
import bmTranslations from '../data/translations/bm.json';

const translations = {
  English: enTranslations,
  BM: bmTranslations,
};

export function useTranslation() {
  const { state } = useApp();
  const currentLanguage = state.language || 'English';

  // Save language to localStorage for API requests
  useEffect(() => {
    const appState = JSON.parse(localStorage.getItem('appState') || '{}');
    appState.language = currentLanguage;
    localStorage.setItem('appState', JSON.stringify(appState));
  }, [currentLanguage]);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return the key if translation is not found
      }
    }

    return value || key;
  }, [currentLanguage]);

  return { t, currentLanguage };
} 