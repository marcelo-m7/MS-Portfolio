/**
 * Shared navigation links used across Navbar and Footer components
 */
export const getNavigationLinks = (t: { nav: { home: string; portfolio: string; about: string; thoughts: string; contact: string } }) => [
  { href: '/', label: t.nav.home },
  { href: '/portfolio', label: t.nav.portfolio },
  { href: '/about', label: t.nav.about },
  { href: '/thoughts', label: t.nav.thoughts },
  { href: '/contact', label: t.nav.contact },
];
