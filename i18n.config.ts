export const locales = ['pt-PT', 'en', 'es', 'fr'] as const;
export const defaultLocale = 'pt-PT' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  'pt-PT': 'Português',
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export const rtlLocales: Locale[] = [];
