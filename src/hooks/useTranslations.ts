import { useMemo } from 'react';
import { useCurrentLanguage } from './useCurrentLanguage';
import { getTranslations, type Translations } from '@/lib/translations';

/**
 * Hook to get translations for the current language
 * Updates automatically when language changes
 */
export function useTranslations(): Translations {
  const language = useCurrentLanguage();
  return useMemo(() => getTranslations(language), [language]);
}
