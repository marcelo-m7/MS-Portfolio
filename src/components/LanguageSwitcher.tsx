import { useEffect, useState } from "react";
import { LanguageCode, SUPPORTED_LANGUAGES, setLanguage, getInitialLanguage } from "@/lib/translate";

const LABELS: Record<LanguageCode, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
  fr: "FR",
};

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("pt");

  useEffect(() => {
    const updateFromDocument = (lang?: string) => {
      if (!lang) return;
      const normalized = SUPPORTED_LANGUAGES.includes(lang as LanguageCode)
        ? (lang as LanguageCode)
        : "pt";
      setCurrentLang(normalized);
    };

    updateFromDocument(document.documentElement.lang);
    const stored = getInitialLanguage();
    setCurrentLang(stored);

    const listener = (event: Event) => {
      const detail = (event as CustomEvent<LanguageCode>).detail;
      updateFromDocument(detail);
    };

    window.addEventListener("monynha:languagechange", listener as EventListener);

    return () => window.removeEventListener("monynha:languagechange", listener as EventListener);
  }, []);

  const handleChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    setLanguage(lang);
  };

  return (
    <div
      role="group"
      aria-label="Selecionar idioma"
      className="inline-flex rounded-full border border-border/60 bg-background/40 p-1 backdrop-blur supports-[backdrop-filter]:bg-background/30"
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => handleChange(lang)}
          aria-pressed={currentLang === lang}
          className={`relative min-w-[2.75rem] rounded-full px-3 py-1 text-xs font-semibold uppercase transition ${
            currentLang === lang
              ? "bg-gradient-to-r from-primary/70 to-secondary/70 text-white shadow-[0_0_12px_rgba(124,58,237,0.45)]"
              : "text-muted-foreground hover:text-foreground"
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-background`}
        >
          <span aria-hidden="true">{LABELS[lang]}</span>
          <span className="sr-only">{`Alterar idioma para ${LABELS[lang]}`}</span>
        </button>
      ))}
    </div>
  );
}
