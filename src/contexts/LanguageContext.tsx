import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { contentByLanguage, defaultLanguage, supportedLanguages, type Content, type Language } from '@/data/content';

type LanguageContextValue = {
  language: Language;
  content: Content;
  setLanguage: (language: Language) => void;
  availableLanguages: typeof supportedLanguages;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const isLanguage = (value: unknown): value is Language =>
  typeof value === 'string' && value in contentByLanguage;

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return defaultLanguage;
    }

    const stored = window.localStorage.getItem('language');
    return isLanguage(stored) ? stored : defaultLanguage;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('language', language);
    }
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      content: contentByLanguage[language],
      setLanguage,
      availableLanguages: supportedLanguages,
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
