import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { I18nProvider, type Messages } from "./i18n/provider";
import {
  DEFAULT_LANGUAGE,
  type SupportedLanguage,
  detectInitialLanguage,
  subscribeLanguageChange,
} from "./lib/language";
import "./index.css";

const messageLoaders: Record<SupportedLanguage, () => Promise<Messages>> = {
  en: () => import("./i18n/messages/en").then((module) => module.default),
  pt: () => import("./i18n/messages/pt").then((module) => module.default),
};

const loadMessages = async (locale: SupportedLanguage): Promise<Messages> => {
  const loader = messageLoaders[locale] ?? messageLoaders[DEFAULT_LANGUAGE];

  if (!loader) {
    return {};
  }

  try {
    const result = await loader();
    return result ?? {};
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}"`, error);

    if (locale !== DEFAULT_LANGUAGE && messageLoaders[DEFAULT_LANGUAGE]) {
      try {
        const fallback = await messageLoaders[DEFAULT_LANGUAGE]!();
        return fallback ?? {};
      } catch (fallbackError) {
        console.error(`Failed to load fallback messages for locale "${DEFAULT_LANGUAGE}"`, fallbackError);
      }
    }

    return {};
  }
};

export const LoadingTranslations = () => <div>Loading translations...</div>;

export const Bootstrap = () => {
  const [locale, setLocale] = useState<SupportedLanguage>(() => detectInitialLanguage());
  const [messages, setMessages] = useState<Messages>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    setIsReady(false);

    loadMessages(locale)
      .then((loaded) => {
        if (!isActive) return;
        setMessages(loaded);
        setIsReady(true);
      })
      .catch(() => {
        if (!isActive) return;
        setMessages({});
        setIsReady(true);
      });

    return () => {
      isActive = false;
    };
  }, [locale]);

  useEffect(() => subscribeLanguageChange(setLocale), []);

  if (!isReady) {
    return <LoadingTranslations />;
  }

  return (
    <I18nProvider locale={locale} messages={messages}>
      <App />
    </I18nProvider>
  );
};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>,
);
