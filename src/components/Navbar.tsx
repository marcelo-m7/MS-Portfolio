import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import MonynhaLogo from './MonynhaLogo'; // Import the new logo component
import { useProfile } from '@/hooks/usePortfolioData';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTranslations } from '@/hooks/useTranslations';
import GooeyMobileNav from './GooeyMobileNav'; // Import the new GooeyMobileNav component

const MotionLink = motion(Link);

export default function Navbar() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const { data: profile } = useProfile();
  const t = useTranslations();

  // Memoize navLinks to prevent recreation on every render
  const navLinks = useMemo(() => [
    { href: '/', label: t.nav.home },
    { href: '/portfolio', label: t.nav.portfolio },
    { href: '/about', label: t.nav.about },
    { href: '/thoughts', label: t.nav.thoughts },
    { href: '/contact', label: t.nav.contact },
  ], [t]);

  // Memoize isActive check
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  return (
    <nav className="fixed left-1/2 top-4 z-50 w-full -translate-x-1/2 px-4 sm:px-6">
      <motion.div
        initial={shouldReduceMotion ? undefined : { y: -100, opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.1 }}
        className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-border/60 bg-card/85 px-6 py-3 shadow-md backdrop-blur-xl"
      >
        <MotionLink
          to="/"
          className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          whileHover={
            shouldReduceMotion ? undefined : { scale: 1.05, boxShadow: '0 0 15px hsl(var(--primary) / 0.3)' }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <MonynhaLogo size={28} className="text-primary" />
          <span className="hidden sm:inline-flex bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {(profile?.name || 'Marcelo').split(' ')[0]}
          </span>
        </MotionLink>

        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          <motion.div
            className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 p-1 shadow-inner"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <MotionLink
                  key={link.href}
                  to={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  {...(!shouldReduceMotion
                    ? {
                        whileHover: {
                          y: -2,
                        },
                      }
                    : {})}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                    />
                  )}
                  {link.label}
                </MotionLink>
              );
            })}
          </motion.div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        {/* Mobile toggles for language and theme, GooeyNav will handle navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <ThemeToggle className="md:hidden" />
        </div>
      </motion.div>
      {/* GooeyNav for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <GooeyMobileNav navLinks={navLinks} />
      </div>
    </nav>
  );
}