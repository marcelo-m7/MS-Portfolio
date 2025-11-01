import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/lib/language';

/**
 * Component that manages lang attribute and hreflang meta tags
 * Ensures proper SEO and accessibility for multilingual content
 */
export function LanguageMetadata() {
  const currentLang = useCurrentLanguage();
  const location = useLocation();

  useEffect(() => {
    // Update html lang attribute (already done in language.ts, but ensure it's set)
    document.documentElement.setAttribute('lang', currentLang);

    // Remove existing hreflang tags
    const existingTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingTags.forEach((tag) => tag.remove());

    // Add hreflang tags for all supported languages
    const baseUrl = window.location.origin;
    const currentPath = location.pathname;

    SUPPORTED_LANGUAGES.forEach((lang) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = `${baseUrl}${currentPath}${currentPath.includes('?') ? '&' : '?'}lang=${lang}`;
      document.head.appendChild(link);
    });

    // Add x-default hreflang for default language
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${baseUrl}${currentPath}`;
    document.head.appendChild(defaultLink);

    // Update og:locale meta tag
    updateOgLocale(currentLang);
  }, [currentLang, location.pathname]);

  return null; // This component doesn't render anything
}

function updateOgLocale(language: SupportedLanguage) {
  const localeMap: Record<SupportedLanguage, string> = {
    pt: 'pt_PT',
    en: 'en_US',
    es: 'es_ES',
    fr: 'fr_FR',
  };

  // Update or create og:locale meta tag
  let ogLocaleTag = document.querySelector('meta[property="og:locale"]');
  if (!ogLocaleTag) {
    ogLocaleTag = document.createElement('meta');
    ogLocaleTag.setAttribute('property', 'og:locale');
    document.head.appendChild(ogLocaleTag);
  }
  ogLocaleTag.setAttribute('content', localeMap[language]);

  // Add og:locale:alternate for other languages
  const existingAlternates = document.querySelectorAll('meta[property="og:locale:alternate"]');
  existingAlternates.forEach((tag) => tag.remove());

  SUPPORTED_LANGUAGES.forEach((lang) => {
    if (lang !== language) {
      const alternateTag = document.createElement('meta');
      alternateTag.setAttribute('property', 'og:locale:alternate');
      alternateTag.setAttribute('content', localeMap[lang]);
      document.head.appendChild(alternateTag);
    }
  });
}
