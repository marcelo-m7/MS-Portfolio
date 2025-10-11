import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import cvData from '../../public/data/cv.json';

export default function Footer() {
  const prefersReducedMotion = useReducedMotion();

  const socialLinks = [
    {
      icon: Github,
      href: cvData.links.github,
      label: 'GitHub',
      colorClass: 'hover:text-primary',
    },
    {
      icon: Linkedin,
      href: cvData.links.linkedin,
      label: 'LinkedIn',
      colorClass: 'hover:text-secondary',
    },
    {
      icon: Mail,
      href: cvData.links.email,
      label: 'Email',
      colorClass: 'hover:text-accent',
    },
  ];

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/about', label: 'Sobre' },
    { href: '/thoughts', label: 'Pensamentos' },
    { href: '/contact', label: 'Contato' },
  ];

  return (
    <footer className="bg-card/80 backdrop-blur-xl border-t border-border/60 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05, boxShadow: '0 0 15px rgba(var(--primary-hsl)/0.3)' }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-display text-base text-white shadow-[0_0_12px_rgba(var(--secondary-hsl)/0.2)]">
                M
              </span>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {cvData.profile.name.split(' ')[0]}
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Monynha Softwares. Todos os direitos reservados.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-2 py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-full p-2 text-muted-foreground transition-colors ${social.colorClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
                aria-label={social.label}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <social.icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}