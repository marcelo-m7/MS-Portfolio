export const siteConfig = {
  siteName: 'MS-Portfolio',
  ownerName: 'Marcelo Santos',
  signature: 'Marcelo Santos / Monynha Softwares',
  title: 'Marcelo Santos — Product Engineer & Founder @ Monynha Softwares',
  shortTitle: 'Marcelo Santos — Monynha Softwares',
  description:
    'Portfólio técnico de Marcelo Santos com produtos digitais, experiências criativas, integrações dinâmicas com GitHub e arquitetura preparada para o ecossistema Monynha Softwares.',
  url: 'https://marcelo.monynha.com',
  ogImage: 'https://marcelo.monynha.com/og-image.svg',
  github: {
    username: import.meta.env.VITE_GITHUB_USERNAME || 'marcelo-m7',
    organization: import.meta.env.VITE_GITHUB_ORG || 'Monynha-Softwares',
    token: import.meta.env.VITE_GITHUB_TOKEN,
    graphQlEndpoint: import.meta.env.VITE_GITHUB_GRAPHQL_ENDPOINT || 'https://api.github.com/graphql',
    restEndpoint: import.meta.env.VITE_GITHUB_REST_ENDPOINT || 'https://api.github.com',
    featuredFallback: [
      'MS-Portfolio',
      'Monynha-com',
      'MonaDocs',
      'BotecoPro',
    ],
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    schema: import.meta.env.VITE_SUPABASE_SCHEMA || 'portfolio',
  },
  brand: {
    accentLabel: 'Powered by Monynha Softwares',
    palette: ['primary', 'secondary', 'accent'] as const,
  },
} as const;

export function buildAbsoluteUrl(pathname = ''): string {
  if (!pathname) return siteConfig.url;
  return new URL(pathname, siteConfig.url).toString();
}
