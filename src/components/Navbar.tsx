import { Link, useLocation } from "react-router-dom";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import cvData from "../../public/data/cv.json";

const linkBaseClasses =
  "relative font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/about", label: "Sobre" },
      { href: "/thoughts", label: "Pensamentos" },
      { href: "/contact", label: "Contato" },
    ],
    [],
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-border/60 bg-card/80 px-4 py-2 shadow-[0_0_20px_hsl(var(--glow-blue)/0.25)] backdrop-blur-xl">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-lg font-display font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="sr-only">Ir para a página inicial</span>
          <span aria-hidden="true" className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {cvData.profile.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden flex-1 items-center justify-end gap-6 md:flex">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`group ${linkBaseClasses} rounded-full px-3 py-2 text-sm ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 rounded-full transition ${
                    isActive(link.href)
                      ? "bg-primary/10 shadow-[0_0_12px_hsl(var(--glow-purple)/0.4)]"
                    : "group-hover:bg-primary/5"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card/70 px-4 py-2 shadow-[0_0_15px_hsl(var(--glow-purple)/0.25)]">
            <a
              href={cvData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href={cvData.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={cvData.links.email}
              className="text-muted-foreground transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen((state) => !state)}
          className="rounded-full p-2 text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0, height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            className="pointer-events-auto absolute top-[4.75rem] w-full max-w-xs rounded-3xl border border-border/70 bg-card/95 p-4 shadow-[0_20px_50px_rgba(16,24,40,0.35)] backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`${linkBaseClasses} rounded-2xl px-4 py-2 text-sm ${
                    isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-3">
                <span className="text-sm font-medium text-muted-foreground">Redes</span>
                <div className="flex items-center gap-3">
                  <a
                    href={cvData.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="GitHub"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={cvData.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href={cvData.links.email}
                    className="text-muted-foreground transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Email"
                  >
                    <Mail size={18} />
                  </a>
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
