import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import MonynhaLogo from './MonynhaLogo'; // Import the new logo component
import { useProfile } from '@/hooks/usePortfolioData';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTranslations } from '@/hooks/useTranslations';

const MotionLink = motion(Link);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const { data: profile } = useProfile();
  const t = useTranslations();

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  // Auto-close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || toggleRef.current?.contains(target)) {
        return;
      }
      closeMenu();
    };
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [isOpen, closeMenu]);

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

  // Memoize menuVariants to prevent recreation on every render
  const menuVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
          <MonynhaLogo size={28} className="text-primary" /> {/* Use the new logo */}
          <span className="hidden sm:inline-flex bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {(profile?.name || 'Marcelo').split(' ')[0]}
          </span>
        </MotionLink>

        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          <motion.div
            variants={menuVariants}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
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
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <ThemeToggle className="md:hidden" />
          <button
            ref={toggleRef}
            onClick={toggleMenu}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-card/70 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              onClick={closeMenu}
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm md:hidden"
              aria-label={t.nav.closeMenu}
            />
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.96 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 210, damping: 26 }}
              className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-[70] px-4 sm:px-6 md:hidden"
              ref={menuRef}
              id="mobile-navigation"
              aria-modal="true"
              role="dialog"
            >
              <div className="mx-auto max-w-6xl rounded-3xl border border-border/70 bg-card/95 p-4 shadow-2xl shadow-primary/10">
                {/* Close button */}
                <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-sm font-medium text-muted-foreground">{t.nav.menu}</span>
                  <button
                    onClick={closeMenu}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/50 text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={t.nav.closeMenu}
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={closeMenu}
                      className={`flex items-center justify-between gap-3 rounded-2xl px-5 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        isActive(link.href)
                          ? 'bg-gradient-to-r from-primary/70 via-secondary/60 to-accent/60 text-primary-foreground shadow-inner'
                          : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span aria-hidden>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}