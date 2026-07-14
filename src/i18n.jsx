import React, { createContext, useContext, useMemo, useState } from 'react';
import { en } from './translations/en.js';
import { kn } from './translations/kn.js';

const dictionaries = { en, kn };
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('vidya-language') || 'en');

  const value = useMemo(() => {
    const t = (key) => dictionaries[language][key] || dictionaries.en[key] || key;
    const switchLanguage = (nextLanguage) => {
      localStorage.setItem('vidya-language', nextLanguage);
      setLanguage(nextLanguage);
    };
    return { language, switchLanguage, t };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
