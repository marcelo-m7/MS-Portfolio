import { useEffect, useMemo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('pt');

  const supportedCodes = useMemo(() => languages.map((lang) => lang.code), []);

  const applyLanguage = useCallback((lang: string) => {
    setCurrentLang(lang);
    if (typeof window !== 'undefined' && (window as any).setLanguage) {
      (window as any).setLanguage(lang);
    }

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let storedLang: string | null = null;
    try {
      storedLang = localStorage.getItem('preferred_language');
    } catch (error) {
      storedLang = null;
    }

    const browserLang = navigator.language?.split('-')[0];
    const initialLang = storedLang && supportedCodes.includes(storedLang)
      ? storedLang
      : (browserLang && supportedCodes.includes(browserLang) ? browserLang : 'pt');

    setCurrentLang(initialLang);
    if (initialLang !== 'pt') {
      // Delay to ensure Google widget is initialised before applying language.
      setTimeout(() => applyLanguage(initialLang), 500);
    } else if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', 'pt');
    }
  }, [applyLanguage, supportedCodes]);

  return (
    <div
      role="group"
      aria-label="Selecionar idioma"
      className="flex items-center gap-1 rounded-full bg-muted/40 p-1"
    >
      {languages.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <Button
            key={lang.code}
            type="button"
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              isActive
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_12px_hsl(var(--primary)/0.35)]'
                : 'text-muted-foreground hover:text-foreground focus-visible:text-foreground'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-background`}
            aria-pressed={isActive}
            onClick={() => applyLanguage(lang.code)}
          >
            <span aria-hidden="true" className="mr-1">
              {lang.flag}
            </span>
            <span className="uppercase">{lang.code}</span>
          </Button>
        );
      })}
    </div>
  );
}
