export const supportedLanguages = ["pt", "en", "es", "fr"] as const;
export type LanguageCode = (typeof supportedLanguages)[number];

let mutationObserver: MutationObserver | null = null;
let lastRequestedLanguage: LanguageCode = "pt";

const hideGoogleArtifacts = () => {
  const selectors = [
    ".goog-te-banner-frame",
    ".goog-te-gadget",
    ".goog-te-gadget-simple",
    ".goog-logo-link",
    ".goog-te-combo",
    "body > .skiptranslate",
    "iframe[id^=':']",
    "#\\:1\\.container",
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      (node as HTMLElement).style.setProperty("display", "none", "important");
      (node as HTMLElement).setAttribute("aria-hidden", "true");
    });
  });

  document.body.style.setProperty("top", "0", "important");
  document.documentElement.style.setProperty("top", "0", "important");
};

const applyLanguage = (lang: LanguageCode) => {
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo) {
    hideGoogleArtifacts();
    return false;
  }

  if (combo.value !== lang) {
    combo.value = lang;
  }

  combo.dispatchEvent(new Event("change"));
  document.documentElement.setAttribute("lang", lang);
  try {
    window.localStorage.setItem("preferredLanguage", lang);
  } catch (error) {
    // ignore storage errors
  }

  window.dispatchEvent(new CustomEvent("app:languagechange", { detail: { lang } }));
  hideGoogleArtifacts();
  return true;
};

const ensureObserver = () => {
  if (mutationObserver) return;

  mutationObserver = new MutationObserver(() => {
    hideGoogleArtifacts();
    applyLanguage(lastRequestedLanguage);
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

export const setLanguage = (lang: string) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const safeLang = supportedLanguages.includes(lang as LanguageCode)
    ? (lang as LanguageCode)
    : "pt";

  lastRequestedLanguage = safeLang;

  if (!applyLanguage(safeLang)) {
    ensureObserver();
  }
};

export const detectInitialLanguage = (): LanguageCode => {
  if (typeof window === "undefined") return "pt";

  const stored = (() => {
    try {
      return window.localStorage.getItem("preferredLanguage") as LanguageCode | null;
    } catch (error) {
      return null;
    }
  })();

  const browserLang = window.navigator.language.split("-")[0];
  const detected = stored ?? (supportedLanguages.includes(browserLang as LanguageCode) ? (browserLang as LanguageCode) : null);

  return detected ?? "pt";
};

export const waitForTranslate = (callback: () => void) => {
  if (typeof window === "undefined") return;

  const combo = document.querySelector(".goog-te-combo");
  if (combo) {
    callback();
    return;
  }

  const observer = new MutationObserver(() => {
    if (document.querySelector(".goog-te-combo")) {
      observer.disconnect();
      callback();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

if (typeof window !== "undefined") {
  window.addEventListener("load", hideGoogleArtifacts);
  document.addEventListener("DOMContentLoaded", hideGoogleArtifacts);
}

export const getCurrentLanguage = (): LanguageCode => {
  if (typeof document === "undefined") return "pt";
  const current = document.documentElement.getAttribute("lang");
  return supportedLanguages.includes(current as LanguageCode) ? (current as LanguageCode) : "pt";
};

declare global {
  interface Window {
    setLanguage?: (lang: string) => void;
  }
}

if (typeof window !== "undefined") {
  window.setLanguage = setLanguage;
}
