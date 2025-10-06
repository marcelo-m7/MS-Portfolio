import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import cvData from "../../public/data/cv.json";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "Sobre" },
  { href: "/thoughts", label: "Pensamentos" },
  { href: "/contact", label: "Contato" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed left-0 right-0 top-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <div className="relative flex items-center justify-between rounded-full border border-border/50 bg-background/70 px-5 py-3 shadow-[0_0_25px_rgba(124,58,237,0.25)] backdrop-blur">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-display font-semibold text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-background"
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {cvData.profile.name}
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/50 px-2 py-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background ${
                    isActive(link.href)
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_18px_rgba(124,58,237,0.35)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 pl-4">
              <a
                href={cvData.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={cvData.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={cvData.links.email}
                className="text-muted-foreground transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <LanguageSwitcher />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full border border-border/60 p-2 text-foreground transition hover:border-secondary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label="Abrir menu de navegação"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 rounded-3xl border border-border/60 bg-background/80 p-6 backdrop-blur md:hidden"
            >
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-full px-4 py-2 text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-background ${
                      isActive(link.href)
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-4 border-t border-border/50 pt-4">
                <a
                  href={cvData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition hover:text-primary"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={cvData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition hover:text-secondary"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={cvData.links.email}
                  className="text-muted-foreground transition hover:text-accent"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <LanguageSwitcher />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
