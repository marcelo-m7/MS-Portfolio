import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

const languages = [
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('pt');

  useEffect(() => {
    // Auto-detect browser language on mount
    const browserLang = navigator.language.split('-')[0];
    if (browserLang !== 'pt' && languages.some(l => l.code === browserLang)) {
      setTimeout(() => setLanguage(browserLang), 1000);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setCurrentLang(lang);
    if (typeof window !== 'undefined' && (window as any).setLanguage) {
      (window as any).setLanguage(lang);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Selecionar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass rounded-2xl">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`rounded-xl ${currentLang === lang.code ? 'bg-primary/20' : ''}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
