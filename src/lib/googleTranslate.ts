const HIDE_SELECTORS = [
  ".goog-te-banner-frame",
  ".goog-te-gadget",
  ".goog-te-gadget-simple",
  ".goog-logo-link",
  ".goog-te-combo",
  "body > .skiptranslate",
  'iframe[id^=":"]',
  "#\\:1\\.container",
] as const;

export const SUPPORTED_LANGUAGES = ["pt", "en", "es", "fr"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

declare global {
  interface Window {
    setLanguage?: (lang: SupportedLanguage) => void;
    __afterGoogleTranslateInit?: () => void;
  }
}

const STORAGE_KEY = "monynha-lang";

let pendingLanguage: SupportedLanguage | null = null;
let comboObserver: MutationObserver | null = null;
let hideObserver: MutationObserver | null = null;
let currentLanguage: SupportedLanguage | null = null;
let initialized = false;

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

const isSupportedLanguage = (value: unknown): value is SupportedLanguage =>
  typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);

const hideGoogleArtifacts = () => {
  if (!isBrowser()) return;

  HIDE_SELECTORS.forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      element.style.setProperty("display", "none", "important");
      element.style.setProperty("visibility", "hidden", "important");
      element.style.setProperty("opacity", "0", "important");
      element.setAttribute("aria-hidden", "true");
      element.setAttribute("tabindex", "-1");
    });
  });

  document.body?.style.setProperty("top", "0px", "important");
};

const dispatchLanguageEvent = (lang: SupportedLanguage) => {
  if (!isBrowser()) return;

  try {
    window.dispatchEvent(new CustomEvent<SupportedLanguage>("monynha:languagechange", { detail: lang }));
  } catch (error) {
    warn("Unable to dispatch language change event", error);
  }
};

const setDocumentLanguage = (lang: SupportedLanguage) => {
  if (!isBrowser()) return;
  document.documentElement.setAttribute("lang", lang);
};

const getCombo = () => (isBrowser() ? document.querySelector<HTMLSelectElement>(".goog-te-combo") : null);

const applyLanguageToCombo = (lang: SupportedLanguage) => {
  const combo = getCombo();
  if (!combo) return false;

  if (combo.value !== lang) {
    combo.value = lang;
  }

  combo.dispatchEvent(new Event("change"));
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

  try {
    comboObserver.observe(document.body, { childList: true, subtree: true });
  } catch (error) {
    warn("Failed to observe Google translate combo", error);
  }
};

const ensureHideObserver = () => {
  if (!isBrowser() || hideObserver) return;

  hideObserver = new MutationObserver(hideGoogleArtifacts);
  try {
    hideObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  } catch (error) {
    warn("Failed to register observer to hide Google artifacts", error);
  }
};

export const initializeGoogleTranslate = () => {
  if (!isBrowser() || initialized) return;

  initialized = true;
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

  hasInitialized = true;
};

export const setLanguage = (lang: SupportedLanguage) => {
  if (!isBrowser()) return;
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;
  if (currentLanguage === lang) return;

  currentLanguage = lang;
  pendingLanguage = lang;
  setStoredLanguage(lang);
  setDocumentLanguage(lang);
  dispatchLanguageEvent(lang);

  const applied = applyLanguageToCombo(lang);
  if (!applied) {
    ensureComboObserver();
  }
};

export const detectInitialLanguage = (): SupportedLanguage => {
  if (!isBrowser()) return "pt";

  const stored = localStorage.getItem(STORAGE_KEY);
  if (isSupportedLanguage(stored)) {
    currentLanguage = stored;
    return stored;
  }

  const navigatorLang = (navigator.language || navigator.languages?.[0] || "pt")
    .split("-")[0]
    .toLowerCase() as SupportedLanguage;

  if (isSupportedLanguage(navigatorLang)) {
    currentLanguage = navigatorLang;
    return navigatorLang;
  }

  currentLanguage = 'pt';
  return 'pt';
};

export const cleanupGoogleTranslate = () => {
  if (comboObserver) {
    comboObserver.disconnect();
    comboObserver = null;
  }
  if (hideObserver) {
    hideObserver.disconnect();
    hideObserver = null;
  }
  pendingLanguage = null;
  currentLanguage = null;
  initialized = false;
  if (isBrowser()) {
    window.setLanguage = undefined;
    window.__afterGoogleTranslateInit = undefined;
  }
};
