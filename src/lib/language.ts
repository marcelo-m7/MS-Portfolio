const STORAGE_KEY = 'monynha-lang';
const LANGUAGE_EVENT = 'monynha:languagechange';
export const DEFAULT_LANGUAGE = 'pt' as const;

export const SUPPORTED_LANGUAGES = [DEFAULT_LANGUAGE, 'en'] as const;
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

type LanguageChangeListener = (language: SupportedLanguage) => void;

const languageListeners = new Set<LanguageChangeListener>();

const notifyLanguageListeners = (language: SupportedLanguage) => {
  languageListeners.forEach((listener) => {
    try {
      listener(language);
    } catch (error) {
      console.error('Failed to execute language change listener', error);
    }
  });
};

let currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

const resolveNavigatorLanguage = (): SupportedLanguage | null => {
  if (!isBrowser()) {
    return null;
  }

  const candidates = Array.isArray(navigator.languages)
    ? [...navigator.languages]
    : [];

  if (navigator.language) {
    candidates.push(navigator.language);
  }

  for (const candidate of candidates) {
    const normalized = candidate?.split('-')[0]?.toLowerCase() ?? '';
    const parsed = parseLanguage(normalized);
    if (parsed) {
      return parsed;
    }
  }

  return null;
};

export const detectInitialLanguage = (): SupportedLanguage => {
  if (!isBrowser()) {
    currentLanguage = DEFAULT_LANGUAGE;
    return currentLanguage;
  }

  const stored = parseLanguage(localStorage.getItem(STORAGE_KEY));
  if (stored) {
    currentLanguage = stored;
    return stored;
  }

  const navigatorLanguage = resolveNavigatorLanguage();
  if (navigatorLanguage) {
    currentLanguage = navigatorLanguage;
    return navigatorLanguage;
  }

  currentLanguage = DEFAULT_LANGUAGE;
  return currentLanguage;
};

export const getCurrentLanguage = () => currentLanguage;

export const subscribeLanguageChange = (listener: LanguageChangeListener) => {
  languageListeners.add(listener);
  return () => {
    languageListeners.delete(listener);
  };
};

export const setLanguage = (language: SupportedLanguage) => {
  const resolved = parseLanguage(language) ?? DEFAULT_LANGUAGE;
  const didChange = currentLanguage !== resolved;

  currentLanguage = resolved;

  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEY, resolved);
    applyLanguage(resolved);
    if (didChange) {
      window.dispatchEvent(new CustomEvent<SupportedLanguage>(LANGUAGE_EVENT, { detail: resolved }));
    }
  }

  if (didChange) {
    notifyLanguageListeners(resolved);
  }
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
