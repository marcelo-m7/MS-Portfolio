import { useEffect, useState } from 'react';
import {
  detectInitialLanguage,
  setLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/lib/googleTranslate';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Idioma atual: ${LANGUAGE_LABELS[current]}`}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {LANGUAGE_SHORT[current]}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl border border-border/60 bg-card/80 p-1 backdrop-blur-xl">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleSelect(lang)}
            className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              current === lang
                ? 'bg-gradient-to-r from-primary/90 via-secondary/80 to-accent/80 text-white'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
            aria-label={LANGUAGE_LABELS[lang]}
          >
            {LANGUAGE_LABELS[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}