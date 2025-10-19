import type { Metadata } from 'next';

import { locales, type Locale } from '@/i18n.config';

export function createLocalizedMetadata(locale: Locale, slug: string = ''): Metadata {
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const languages = Object.fromEntries(
    locales.map((availableLocale) => [availableLocale, `/${availableLocale}${normalizedSlug}`]),
  );

  return {
    alternates: {
      canonical: `/${locale}${normalizedSlug}`.replace(/\/$/, ''),
      languages,
    },
  };
}
