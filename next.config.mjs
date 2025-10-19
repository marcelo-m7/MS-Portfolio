import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.config.ts');

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
};

export default withNextIntl(nextConfig);
