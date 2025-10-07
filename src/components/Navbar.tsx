import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import cvData from '../../public/data/cv.json';

const MotionLink = motion(Link);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/about', label: 'Sobre' },
    { href: '/thoughts', label: 'Pensamentos' },
    { href: '/contact', label: 'Contato' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const shouldReduceMotion = useReducedMotion();

  return (
    <nav className="fixed left-1/2 top-4 z-50 w-full -translate-x-1/2 px-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border/60 bg-card/70 px-4 py-3 shadow-[0_20px_45px_-25px_rgba(56,189,248,0.55)] backdrop-blur-xl">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-display text-base text-white shadow-[0_0_12px_rgba(56,189,248,0.45)]">
            M
          </span>
          <span className="hidden sm:inline-flex bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {cvData.profile.name}
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-6 md:flex">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/40 p-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <MotionLink
                  key={link.href}
                  to={link.href}
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active ? 'text-white' : 'text-muted-foreground'
                  }`}
                  {...(!shouldReduceMotion
                    ? {
                        whileHover: {
                          y: -2,
                          boxShadow:
                            '0 12px 24px -18px rgba(56,189,248,0.6), 0 0 12px rgba(124,58,237,0.45)',
                        },
                      }
                    : {})}
                >
                  <span
                    aria-hidden
                    translate="no"
                    className={`pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary/90 via-secondary/80 to-accent/80 transition-all duration-200 ${
                      active ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  />
                  {link.label}
                </MotionLink>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pl-4">
            <a
              href={cvData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href={cvData.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={cvData.links.email}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <LanguageSwitcher />
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/70 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          aria-label="Abrir menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mt-3 max-w-6xl rounded-3xl border border-border/60 bg-card/80 p-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isActive(link.href) ? 'bg-gradient-to-r from-primary/60 via-secondary/50 to-accent/50 text-white' : 'text-muted-foreground hover:bg-card'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
              <div className="flex items-center gap-3">
                <a
                  href={cvData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
                <a
                  href={cvData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={cvData.links.email}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              </div>
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
