import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getCurrentLanguage, setLanguage, supportedLanguages, type LanguageCode } from "@/lib/googleTranslate";

const labels: Record<LanguageCode, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
  fr: "FR",
};

const languageNames: Record<LanguageCode, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
  fr: "Français",
};

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState<LanguageCode>(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      const detail = (event as CustomEvent<{ lang: LanguageCode }>).detail;
      if (detail?.lang) {
        setCurrent(detail.lang);
      }
    };

    window.addEventListener("app:languagechange", handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener("app:languagechange", handleLanguageChange as EventListener);
    };
  }, []);

  const handleClick = (lang: LanguageCode) => {
    setCurrent(lang);
    setLanguage(lang);
  };

  return (
    <div
      role="group"
      aria-label="Selecionar idioma"
      className="inline-flex rounded-full border border-border/60 bg-card/80 p-1 shadow-[0_0_15px_hsl(var(--glow-blue)/0.25)] backdrop-blur"
    >
      {supportedLanguages.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => handleClick(lang)}
          aria-pressed={current === lang}
          className={cn(
            "relative min-w-[2.5rem] rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            current === lang
              ? "bg-gradient-to-r from-primary/90 to-secondary/80 text-primary-foreground shadow-[0_0_12px_hsl(var(--glow-purple)/0.45)]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="sr-only">{languageNames[lang]}</span>
          <span aria-hidden="true">{labels[lang]}</span>
        </button>
      ))}
    </div>
  );
}
