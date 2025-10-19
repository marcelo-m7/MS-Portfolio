import { useEffect, useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { createInstance, type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "../lib/language";

export type Messages = Record<string, unknown>;

export interface I18nProviderProps {
  children: ReactNode;
  fallbackLocale?: string;
  locale: string;
  messages: Messages;
}

const buildSupportedLanguages = (locale: string, fallbackLocale: string) => {
  const languages = new Set<string>([...SUPPORTED_LANGUAGES, fallbackLocale, locale]);
  return Array.from(languages);
};

const initializeInstance = async (
  instance: I18nInstance,
  locale: string,
  fallbackLocale: string,
  messages: Messages,
) => {
  const supportedLngs = buildSupportedLanguages(locale, fallbackLocale);

  instance.options.supportedLngs = supportedLngs;
  instance.options.fallbackLng = fallbackLocale;

  if (!instance.isInitialized) {
    await instance.init({
      lng: locale,
      fallbackLng: fallbackLocale,
      supportedLngs,
      resources: {
        [locale]: {
          translation: messages,
        },
      },
      interpolation: { escapeValue: false },
      returnNull: false,
      initImmediate: false,
    });
    return;
  }

  instance.addResourceBundle(locale, "translation", messages, true, true);
  if (instance.language !== locale) {
    await instance.changeLanguage(locale);
  }
};

export const I18nProvider = ({
  children,
  fallbackLocale = DEFAULT_LANGUAGE,
  locale,
  messages,
}: I18nProviderProps) => {
  const [instance] = useState(() => {
    const i18nInstance = createInstance();
    i18nInstance.use(initReactI18next);
    return i18nInstance;
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      try {
        await initializeInstance(instance, locale, fallbackLocale, messages);
        if (isActive) {
          setIsReady(true);
        }
      } catch (error) {
        console.error(`Failed to configure i18n for locale "${locale}"`, error);
      }
    };

    run();

    return () => {
      isActive = false;
    };
  }, [fallbackLocale, instance, locale, messages]);

  if (!isReady) {
    return null;
  }

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
};
