import { useCallback, useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

declare global {
  interface Window {
    setLanguage?: (lang: string) => void;
  }
}

const languages = [
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('pt');

  const normalizeLang = useCallback((lang: string | null | undefined) => {
    if (!lang) return 'pt';
    const normalized = lang.split('-')[0];
    return languages.some((l) => l.code === normalized) ? normalized : 'pt';
  }, []);

  const triggerGoogleTranslate = useCallback((lang: string, attempt = 0) => {
    if (typeof window === 'undefined') return;
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
      return;
    }

    if (attempt < 5) {
      setTimeout(() => triggerGoogleTranslate(lang, attempt + 1), 300 * (attempt + 1));
    }
  }, []);

  const applyLanguage = useCallback((lang: string) => {
    const normalized = normalizeLang(lang);
    setCurrentLang(normalized);
    document.documentElement.setAttribute('lang', normalized);

    try {
      localStorage.setItem('preferredLanguage', normalized);
    } catch (error) {
      /* ignore */
    }

    if (typeof window !== 'undefined') {
      if (typeof window.setLanguage === 'function') {
        window.setLanguage(normalized);
      } else {
        triggerGoogleTranslate(normalized);
      }
    }
  }, [normalizeLang, triggerGoogleTranslate]);

  useEffect(() => {
    const storedLang = (() => {
      try {
        return localStorage.getItem('preferredLanguage');
      } catch (error) {
        return null;
      }
    })();

    const browserLang = normalizeLang(navigator.language);
    const initialLang = normalizeLang(storedLang || browserLang);

    setCurrentLang(initialLang);
    document.documentElement.setAttribute('lang', initialLang);

    if (!storedLang) {
      try {
        localStorage.setItem('preferredLanguage', initialLang);
      } catch (error) {
        /* ignore */
      }
    }

    if (initialLang !== 'pt') {
      triggerGoogleTranslate(initialLang);
    }

    const handleLanguageChange = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail) {
        const updated = normalizeLang(detail);
        setCurrentLang(updated);
        document.documentElement.setAttribute('lang', updated);
      }
    };

    document.addEventListener('languagechange', handleLanguageChange as EventListener);
    return () => {
      document.removeEventListener('languagechange', handleLanguageChange as EventListener);
    };
  }, [normalizeLang, triggerGoogleTranslate]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Selecionar idioma"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass rounded-2xl">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => applyLanguage(lang.code)}
            className={`rounded-xl focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              currentLang === lang.code ? 'bg-primary/20 text-foreground' : ''
            }`}
            aria-pressed={currentLang === lang.code}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
