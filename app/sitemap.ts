import type { MetadataRoute } from 'next';

import { locales } from '@/i18n.config';

const baseUrl = 'https://ms-portfolio.vercel.app';
const routes = ['/', '/portfolio', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.flatMap((locale) =>
    routes.map((route) => {
      const localizedPath = route === '/' ? '' : route;
      const url = `${baseUrl}/${locale}${localizedPath}`;
      const languages = Object.fromEntries(
        locales.map((otherLocale) => [otherLocale, `${baseUrl}/${otherLocale}${localizedPath}`]),
      );

      return {
        url,
        lastModified: now,
        alternates: {
          languages,
        },
      } as MetadataRoute.Sitemap[number];
    }),
  );
}
