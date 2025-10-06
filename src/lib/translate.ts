import { useEffect } from 'react';

export const SUPPORTED_LANGUAGES = ["pt", "en", "es", "fr"] as const;
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];
const STORAGE_KEY = "monynha-lang";
const HIDDEN_SELECTORS = [
  "#google_translate_element",
  ".goog-te-banner-frame",
  ".goog-te-gadget",
  ".goog-te-gadget-simple",
  ".goog-logo-link",
  ".goog-te-combo",
  "body > .skiptranslate",
  "iframe[id^=':']",
  "#\\:1\\.container",
];

let pendingLanguage: LanguageCode | null = null;
let attempts = 0;
const MAX_ATTEMPTS = 60;

function getSelect(): HTMLSelectElement | null {
  return document.querySelector(".goog-te-combo");
}

function hideGoogleArtifacts() {
  HIDDEN_SELECTORS.forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      element.style.setProperty("display", "none", "important");
      element.style.setProperty("visibility", "hidden", "important");
      element.setAttribute("aria-hidden", "true");
    });
  });

  if (document.body) {
    document.body.style.top = "0px";
    document.body.style.position = "relative";
  }
}

function applyLanguage(select: HTMLSelectElement, lang: LanguageCode) {
  if (select.value !== lang) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  }
  document.documentElement.setAttribute("lang", lang);
  document.body?.setAttribute("data-current-lang", lang);
  window.dispatchEvent(new CustomEvent("monynha:languagechange", { detail: lang }));
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore storage errors
  }
}

function tryApplyLanguage() {
  hideGoogleArtifacts();
  const select = getSelect();
  if (select && pendingLanguage) {
    applyLanguage(select, pendingLanguage);
    pendingLanguage = null;
    attempts = 0;
    return;
  }

  if (attempts < MAX_ATTEMPTS) {
    attempts += 1;
    window.setTimeout(tryApplyLanguage, 200);
  }
}

export function setLanguage(lang: LanguageCode) {
  const normalized = SUPPORTED_LANGUAGES.includes(lang) ? lang : "pt";
  pendingLanguage = normalized;
  attempts = 0;
  tryApplyLanguage();
}

export function getInitialLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
  } catch {
    // ignore
  }

  const browserLang = navigator?.language?.split("-")[0]?.toLowerCase() as LanguageCode | undefined;
  if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang)) {
    return browserLang;
  }

  return "pt";
}

export function useGoogleTranslateGuard() {
  useEffect(() => {
    hideGoogleArtifacts();
    const observer = new MutationObserver(hideGoogleArtifacts);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
    });

    return () => observer.disconnect();
  }, []);
}

declare global {
  interface Window {
    setLanguage?: (lang: LanguageCode) => void;
  }
}

export function registerGlobalLanguageSetter() {
  window.setLanguage = setLanguage;
}
