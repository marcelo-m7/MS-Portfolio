const STORAGE_KEY = 'monynha-lang';
const LANGUAGE_EVENT = 'monynha:languagechange';
const DEFAULT_LANGUAGE = 'pt' as const;

export const SUPPORTED_LANGUAGES = [DEFAULT_LANGUAGE] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const parseLanguage = (value: string | null): SupportedLanguage | null => {
  if (!value) return null;
  const normalized = value.toLowerCase();
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(normalized)
    ? (normalized as SupportedLanguage)
    : null;
};

const applyLanguage = (language: SupportedLanguage) => {
  if (!isBrowser()) return;
  document.documentElement.setAttribute('lang', language);
};

export const detectInitialLanguage = (): SupportedLanguage => {
  if (!isBrowser()) {
    return DEFAULT_LANGUAGE;
  }

  const stored = parseLanguage(localStorage.getItem(STORAGE_KEY));
  if (stored) {
    return stored;
  }

  const browserLanguage = navigator.language || navigator.languages?.[0];
  if (browserLanguage) {
    const normalized = browserLanguage.split('-')[0]?.toLowerCase() || '';
    const parsed = parseLanguage(normalized);
    if (parsed) {
      return parsed;
    }
  }

  return DEFAULT_LANGUAGE;
};

export const setLanguage = (language: SupportedLanguage) => {
  if (!isBrowser()) return;
  const resolved = parseLanguage(language) ?? DEFAULT_LANGUAGE;
  localStorage.setItem(STORAGE_KEY, resolved);
  applyLanguage(resolved);
  window.dispatchEvent(new CustomEvent<SupportedLanguage>(LANGUAGE_EVENT, { detail: resolved }));
};

export const syncDocumentLanguage = () => {
  if (!isBrowser()) return;
  applyLanguage(detectInitialLanguage());
};

export const getStorageKey = () => STORAGE_KEY;
export const getLanguageEventName = () => LANGUAGE_EVENT;

if (isBrowser()) {
  applyLanguage(detectInitialLanguage());
}
