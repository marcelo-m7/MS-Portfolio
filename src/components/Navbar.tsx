import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import MonynhaLogo from './MonynhaLogo'; // Import the new logo component
import cvData from '../../public/data/cv.json';
import { ThemeToggle } from './ThemeToggle';

const MotionLink = motion(Link);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/about', label: 'Sobre' },
    { href: '/thoughts', label: 'Pensamentos' },
    { href: '/contact', label: 'Contato' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const menuVariants = {
    hidden: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: '-100vh', transition: { duration: 0.4, ease: 'easeOut' } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <nav className="fixed left-1/2 top-4 z-50 w-full -translate-x-1/2 px-4 sm:px-6">
      <motion.div
        initial={shouldReduceMotion ? undefined : { y: -100, opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.1 }}
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-border/60 bg-card/85 px-6 py-3 shadow-md backdrop-blur-xl"
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
            {cvData.profile.name.split(' ')[0]}
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
          <ThemeToggle />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/70 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          aria-label="Abrir menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
            exit={shouldReduceMotion ? undefined : 'hidden'}
            variants={mobileMenuVariants}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/70 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-full px-6 py-3 text-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isActive(link.href) ? 'bg-gradient-to-r from-primary/60 via-secondary/50 to-accent/50 text-white' : 'text-muted-foreground hover:bg-card'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <ThemeToggle className="mt-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}