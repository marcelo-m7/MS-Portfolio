import { useEffect, useMemo, useRef } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

const srLabels: Record<string, string> = {
  pt: 'Selecionar idioma',
  en: 'Select language',
  es: 'Seleccionar idioma',
  fr: 'Choisir la langue',
};

export default function LanguageSwitcher() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const autoDetectRef = useRef(false);

  useEffect(() => {
    if (autoDetectRef.current || typeof navigator === 'undefined') {
      return;
    }

    const browserLang = navigator.language.split('-')[0];
    const match = availableLanguages.find((item) => item.code === browserLang);

    if (match) {
      autoDetectRef.current = true;
      setLanguage(match.code);
    } else {
      autoDetectRef.current = true;
    }
  }, [availableLanguages, setLanguage]);

  const srLabel = useMemo(() => srLabels[language] ?? srLabels.en, [language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{srLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass rounded-2xl">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`rounded-xl ${language === lang.code ? 'bg-primary/20' : ''}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
