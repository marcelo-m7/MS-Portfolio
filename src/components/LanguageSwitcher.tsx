import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  cleanupGoogleTranslateArtifacts,
  getGoogleTranslateLanguage,
  initGoogleTranslate,
  setGoogleTranslateLanguage,
} from '@/lib/googleTranslate';
import cvData from '../../public/data/cv.json';

const languages = [
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const languageCodes = languages.map((lang) => lang.code);

export default function LanguageSwitcher() {
  const defaultLanguage = cvData.langDefault ?? languages[0].code;
  const [currentLang, setCurrentLang] = useState(defaultLanguage);
  const [isReady, setIsReady] = useState(false);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    const initialise = initGoogleTranslate({
      defaultLanguage,
      languages: languageCodes,
    }).then(() => {
      if (cancelled) return;
      cleanupGoogleTranslateArtifacts();
      setCurrentLang(getGoogleTranslateLanguage(defaultLanguage));
      setIsReady(true);
    });

    initPromiseRef.current = initialise;

    const observer = new MutationObserver(() => cleanupGoogleTranslateArtifacts());
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    cleanupGoogleTranslateArtifacts();

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [defaultLanguage]);

  const handleLanguageChange = useCallback((lang: string) => {
    setCurrentLang(lang);

    const initPromise =
      initPromiseRef.current ??
      initGoogleTranslate({
        defaultLanguage,
        languages: languageCodes,
      });

    initPromiseRef.current = initPromise;

    initPromise.then(() => {
      const updated = setGoogleTranslateLanguage(lang, defaultLanguage);
      const effectiveLang = updated
        ? getGoogleTranslateLanguage(defaultLanguage)
        : defaultLanguage;
      setCurrentLang(effectiveLang);
      cleanupGoogleTranslateArtifacts();
    });
  }, [defaultLanguage]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl"
          aria-label={`Idioma atual: ${currentLang.toUpperCase()}`}
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Selecionar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass rounded-2xl">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`rounded-xl ${currentLang === lang.code ? 'bg-primary/20' : ''}`}
            disabled={!isReady && lang.code !== defaultLanguage}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
