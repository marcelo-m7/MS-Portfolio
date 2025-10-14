import { useEffect, useState } from 'react';

const SUPPORTED_LANGUAGES = ['pt', 'en', 'es', 'fr'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof navigator === 'undefined') {
    return 'pt';
  }

  const primary = (navigator.language || navigator.languages?.[0] || 'pt')
    .split('-')[0]
    .toLowerCase();

  if (SUPPORTED_LANGUAGES.includes(primary as SupportedLanguage)) {
    return primary as SupportedLanguage;
  }

  return 'pt';
};

export const useCurrentLanguage = () => {
  const [language, setLanguage] = useState<SupportedLanguage>(() => detectBrowserLanguage());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLanguageChange = () => {
      setLanguage(detectBrowserLanguage());
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  return language;
};

export const languageToLocale = (language: SupportedLanguage) => {
  switch (language) {
    case 'en':
      return 'en-US';
    case 'es':
      return 'es-ES';
    case 'fr':
      return 'fr-FR';
    case 'pt':
    default:
      return 'pt-PT';
  }
};
