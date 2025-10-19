import deepmerge from 'deepmerge';

import { defaultLocale, type Locale } from '../../../i18n.config';

export type Messages = Record<string, unknown>;

function collectMissingKeys(base: Messages, target: Messages, prefix = ''): string[] {
  return Object.entries(base).flatMap(([key, value]) => {
    const nextPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const child = typeof target[key] === 'object' && target[key] !== null ? (target[key] as Messages) : {};
      return collectMissingKeys(value as Messages, child, nextPath);
    }

    if (!(key in target)) {
      return [nextPath];
    }

    return [];
  });
}

async function importMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case 'en':
      return (await import('@/locales/en.json')).default;
    case 'es':
      return (await import('@/locales/es.json')).default;
    case 'fr':
      return (await import('@/locales/fr.json')).default;
    case 'pt-PT':
    default:
      return (await import('@/locales/pt-PT.json')).default;
  }
}

export async function getMessages(locale: Locale): Promise<Messages> {
  const baseMessages = await importMessages(defaultLocale);
  if (locale === defaultLocale) {
    return { ...baseMessages, __meta: { locale, fallbackKeys: [] } } as Messages;
  }

  try {
    const localeMessages = await importMessages(locale);
    const merged = deepmerge(baseMessages, localeMessages, {
      arrayMerge: (_, sourceArray) => sourceArray,
    });
    const fallbackKeys = collectMissingKeys(baseMessages, localeMessages);
    return {
      ...merged,
      __meta: { locale, fallbackKeys },
    } as Messages;
  } catch (error) {
    console.warn(
      `Missing translation file for locale "${locale}". Falling back to ${defaultLocale}.`,
      error,
    );
    return { ...baseMessages, __meta: { locale, fallbackKeys: Object.keys(baseMessages) } } as Messages;
  }
}
