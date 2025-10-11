const HIDE_SELECTORS = [
  '.goog-te-banner-frame',
  '.goog-te-gadget',
  '.goog-te-gadget-simple',
  '.goog-logo-link',
  '.goog-te-combo',
  'body > .skiptranslate',
  'iframe[id^=":"]',
  '#\\:1\\.container',
];

export const SUPPORTED_LANGUAGES = ['pt', 'en', 'es', 'fr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = 'monynha-lang';

let pendingLanguage: SupportedLanguage | null = null;
let comboObserver: MutationObserver | null = null;
let hideObserver: MutationObserver | null = null;

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

declare global {
  interface Window {
    setLanguage: (lang: SupportedLanguage) => void;
    __afterGoogleTranslateInit?: () => void;
  }
}

const hideGoogleArtifacts = () => {
  if (!isBrowser()) return;

  HIDE_SELECTORS.forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.setAttribute('aria-hidden', 'true');
      element.setAttribute('tabindex', '-1');
    });
  });

  document.body?.style.setProperty('top', '0px', 'important');
};

const dispatchLanguageEvent = (lang: SupportedLanguage) => {
  if (!isBrowser()) return;

  window.dispatchEvent(new CustomEvent<SupportedLanguage>('monynha:languagechange', { detail: lang }));
};

const setDocumentLanguage = (lang: SupportedLanguage) => {
  if (!isBrowser()) return;
  document.documentElement.setAttribute('lang', lang);
};

const getCombo = () =>
  isBrowser() ? document.querySelector<HTMLSelectElement>('.goog-te-combo') : null;

const applyLanguageToCombo = (lang: SupportedLanguage) => {
  const combo = getCombo();
  if (!combo) return false;

  if (combo.value !== lang) {
    combo.value = lang;
  }

  combo.dispatchEvent(new Event('change'));
  pendingLanguage = null;
  return true;
};

const ensureComboObserver = () => {
  if (!isBrowser() || comboObserver) return;

  comboObserver = new MutationObserver(() => {
    hideGoogleArtifacts();
    if (pendingLanguage) {
      const applied = applyLanguageToCombo(pendingLanguage);
      if (applied && comboObserver) {
        comboObserver.disconnect();
        comboObserver = null;
      }
    }
  });

  comboObserver.observe(document.body, { childList: true, subtree: true });
};

const ensureHideObserver = () => {
  if (!isBrowser() || hideObserver) return;

  hideObserver = new MutationObserver(hideGoogleArtifacts);
  hideObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};

export const initializeGoogleTranslate = () => {
  if (!isBrowser()) return;

  hideGoogleArtifacts();
  ensureHideObserver();
  ensureComboObserver();
  window.setLanguage = setLanguage;
  window.__afterGoogleTranslateInit = () => {
    hideGoogleArtifacts();
    ensureComboObserver();
    if (pendingLanguage) {
      applyLanguageToCombo(pendingLanguage);
    }
  };
};

export const setLanguage = (lang: SupportedLanguage) => {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;
  if (!isBrowser()) return;

  pendingLanguage = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  setDocumentLanguage(lang);
  dispatchLanguageEvent(lang);

  const applied = applyLanguageToCombo(lang);
  if (!applied) {
    ensureComboObserver();
  }
};

export const detectInitialLanguage = (): SupportedLanguage => {
  if (!isBrowser()) return 'pt';

  const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }

  const navigatorLang = (navigator.language || navigator.languages?.[0] || 'pt')
    .split('-')[0]
    .toLowerCase() as SupportedLanguage;

  if (SUPPORTED_LANGUAGES.includes(navigatorLang)) {
    return navigatorLang;
  }

  return 'pt';
};

if (isBrowser()) {
  initializeGoogleTranslate();
}

export const cleanupGoogleTranslate = () => {
  if (comboObserver) {
    comboObserver.disconnect();
    comboObserver = null;
  }
  if (hideObserver) {
    hideObserver.disconnect();
    hideObserver = null;
  }
};
