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
          className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Idioma atual: ${LANGUAGE_LABELS[current]}. Abrir seletor de idioma.`}
        >
          <span aria-hidden>{LANGUAGE_SHORT[current]}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 rounded-xl border border-border/60 bg-card/80 p-1 backdrop-blur-xl">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleSelect(lang)}
            className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              current === lang
                ? 'bg-gradient-to-r from-primary/90 via-secondary/80 to-accent/80 text-white'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
            aria-selected={current === lang}
          >
            {LANGUAGE_LABELS[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}