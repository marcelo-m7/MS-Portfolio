import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import MonynhaLogo from './MonynhaLogo';
import { useProfile } from '@/hooks/usePortfolioData';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTranslations } from '@/hooks/useTranslations';
import MobileNavLink from './MobileNavLink'; // <-- New Import

const MotionLink = motion(Link);

export default function Navbar() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const { data: profile } = useProfile();
  const t = useTranslations();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    // Ensure menu is closed whenever the path changes
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]); // Depend on location.pathname

  // Close menu on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

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

  const mobileMenuVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -50, // Drop down further
      rotate: -5, // Slight rotation
      scale: 0.8, // Shrink slightly
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.4, // Longer duration for the bounce effect
      },
    },
  }), []);
  
  // Define containerVariants for the staggered list
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }), []);

  const mobileLinkVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }), []);

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

        {/* Desktop Navigation */}
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

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <ThemeToggle className="hidden sm:block" /> {/* Keep theme toggle visible on small screens */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full p-2 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={isMobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 right-0 top-full mt-3 mx-4 md:hidden rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur-xl origin-top"
          >
            <motion.nav
              variants={containerVariants}
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'visible'}
              className="flex flex-col space-y-2"
            >
              {navLinks.map((link, index) => (
                <motion.div key={link.href} variants={mobileLinkVariants}>
                  <MobileNavLink
                    to={link.href}
                    label={link.label}
                    isActive={isActive(link.href)}
                    onClose={() => setIsMobileMenuOpen(false)}
                  />
                </motion.div>
              ))}
            </motion.nav>
            <div className="mt-4 pt-4 border-t border-border/60 flex justify-between items-center">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                {t.nav.menu}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}