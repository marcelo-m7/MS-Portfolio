/*
 * Utility helpers to integrate Google Translate without letting it take over the DOM tree.
 * The helpers below lazy-load the script, expose a promise that resolves when the widget is
 * ready, and make sure any of the injected overlays stay hidden so navigation keeps working.
 */

type TranslateConfig = {
  defaultLanguage: string;
  languages: string[];
};

type TranslateWindow = Window & {
  google?: {
    translate?: {
      TranslateElement?: new (
        options: Record<string, unknown>,
        elementId: string,
      ) => void;
    };
  };
  googleTranslateElementInit?: () => void;
};

const getTranslateWindow = () => window as TranslateWindow;

const SCRIPT_ID = "google-translate-script";
const CONTAINER_ID = "google_translate_element";
const CALLBACK_NAME = "googleTranslateElementInit";

let initPromise: Promise<void> | null = null;

const ensureContainer = () => {
  if (typeof document === "undefined") return;
  if (!document.getElementById(CONTAINER_ID)) {
    const container = document.createElement("div");
    container.id = CONTAINER_ID;
    container.style.display = "none";
    document.body.appendChild(container);
  }
};

const updateCookie = (from: string, to: string) => {
  if (typeof document === "undefined") return;
  const value = `/${from}/${to}`;
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  document.cookie = `googtrans=${value};expires=${expires.toUTCString()};path=/`;

  if (typeof window !== "undefined") {
    const host = getTranslateWindow().location.hostname;
    if (host.includes(".")) {
      document.cookie = `googtrans=${value};expires=${expires.toUTCString()};path=/;domain=.${host}`;
    }
  }
};

export const cleanupGoogleTranslateArtifacts = () => {
  if (typeof document === "undefined") return;

  const hideSelectors = [
    ".goog-logo-link",
    ".goog-te-gadget",
    ".goog-te-banner-frame",
    ".goog-te-menu-frame",
    ".goog-te-balloon-frame",
  ];

  hideSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      const el = element as HTMLElement;
      el.style.display = "none";
      el.style.visibility = "hidden";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    });
  });

  document.querySelectorAll(".skiptranslate, .VIpgJd-ZVi9od-ORHb-OEVmcd").forEach((element) => {
    const el = element as HTMLElement;
    el.style.pointerEvents = "none";
    el.style.background = "transparent";
    el.style.opacity = "0";
  });

  if (document.body) {
    document.body.style.top = "0px";
  }
  if (document.documentElement) {
    document.documentElement.style.top = "0px";
  }
};

const initialiseWidget = (config: TranslateConfig, resolve: () => void) => {
  const win = getTranslateWindow();
  if (typeof win.google?.translate?.TranslateElement !== "function") {
    resolve();
    return;
  }

  ensureContainer();

  // The widget re-creates the container every time, so protect against duplicates.
  new win.google.translate.TranslateElement(
    {
      pageLanguage: config.defaultLanguage,
      includedLanguages: config.languages.join(","),
      autoDisplay: false,
    },
    CONTAINER_ID,
  );

  cleanupGoogleTranslateArtifacts();
  resolve();
};

export const initGoogleTranslate = (config: TranslateConfig): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (initPromise) {
    return initPromise;
  }

  ensureContainer();

  initPromise = new Promise<void>((resolve) => {
    const win = getTranslateWindow();
    const onReady = () => initialiseWidget(config, resolve);

    win.googleTranslateElementInit = onReady;

    if (typeof win.google?.translate?.TranslateElement === "function") {
      onReady();
      return;
    }

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", onReady, { once: true });
      existingScript.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `//translate.google.com/translate_a/element.js?cb=${CALLBACK_NAME}`;
    script.async = true;
    script.addEventListener("load", onReady, { once: true });
    script.addEventListener("error", () => resolve(), { once: true });
    document.body.appendChild(script);
  });

  return initPromise;
};

export const getGoogleTranslateLanguage = (defaultLanguage: string): string => {
  if (typeof document === "undefined") return defaultLanguage;
  const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  if (match && match[1]) {
    return match[1];
  }
  if (typeof document.documentElement?.lang === "string" && document.documentElement.lang) {
    return document.documentElement.lang;
  }
  return defaultLanguage;
};

export const setGoogleTranslateLanguage = (
  language: string,
  defaultLanguage: string,
): boolean => {
  if (typeof document === "undefined") return false;
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo) return false;

  if (combo.value !== language) {
    combo.value = language;
  }
  combo.dispatchEvent(new Event("change"));

  updateCookie(defaultLanguage, language);
  cleanupGoogleTranslateArtifacts();

  if (typeof document.documentElement !== "undefined") {
    document.documentElement.setAttribute("lang", language);
  }

  return true;
};
