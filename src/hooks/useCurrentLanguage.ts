import { useEffect, useState } from 'react';
import {
  detectInitialLanguage,
  type SupportedLanguage,
} from '@/lib/googleTranslate';

const LANGUAGE_EVENT = 'monynha:languagechange';

export const useCurrentLanguage = () => {
  const [language, setLanguage] = useState<SupportedLanguage>(
    detectInitialLanguage(),
  );

  useEffect(() => {
    const handle = (event: Event) => {
      const detail = (event as CustomEvent<SupportedLanguage>).detail;
      if (detail) {
        setLanguage(detail);
      }
    };

    window.addEventListener(LANGUAGE_EVENT, handle);
    return () => window.removeEventListener(LANGUAGE_EVENT, handle);
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
