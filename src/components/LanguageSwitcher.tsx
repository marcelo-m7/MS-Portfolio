import { useEffect, useState } from 'react';
import {
  detectInitialLanguage,
  setLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/lib/googleTranslate';
import { motion, useReducedMotion } from 'framer-motion';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

const LANGUAGE_SHORT: Record<SupportedLanguage, string> = {
  pt: 'PT',
  en: 'EN',
  es: 'ES',
  fr: 'FR',
};

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState<SupportedLanguage>('pt');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setCurrent(detectInitialLanguage());

    const handleLanguageChange = (event: Event) => {
      const detail = (event as CustomEvent<SupportedLanguage>).detail;
      if (detail && SUPPORTED_LANGUAGES.includes(detail)) {
        setCurrent(detail);
      }
    };

    window.addEventListener('monynha:languagechange', handleLanguageChange);
    return () => window.removeEventListener('monynha:languagechange', handleLanguageChange);
  }, []);

  const handleSelect = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setCurrent(lang);
  };

  return (
    <div
      role="group"
      aria-label="Selecionar idioma"
      className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 backdrop-blur-sm"
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = current === lang;
        return (
          <motion.button
            key={lang}
            type="button"
            onClick={() => handleSelect(lang)}
            className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-[transform,box-shadow,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              isActive
                ? 'bg-gradient-to-r from-primary/90 via-secondary/80 to-accent/80 text-white shadow-[0_0_12px_rgba(var(--primary-hsl)/0.2)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/80'
            }`}
            aria-pressed={isActive}
            aria-label={LANGUAGE_LABELS[lang]}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="sr-only">{LANGUAGE_LABELS[lang]}</span>
            <span aria-hidden>{LANGUAGE_SHORT[lang]}</span>
          </motion.button>
        );
      })}
    </div>
  );
}