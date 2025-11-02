import { useEffect, useState, useMemo } from 'react';
import { useCurrentLanguage } from './useCurrentLanguage';
import { translateText, translateTexts } from '@/lib/translateService';
import type { SupportedLanguage } from '@/lib/language';

/**
 * Hook to get translated text synchronously (returns immediately for source language)
 * Optimized for the common case where currentLang === sourceLang
 * For async translation with loading state, use useAsyncTranslatedText
 */
export function useTranslatedText(
  originalText: string | undefined | null,
  sourceLang: SupportedLanguage = 'pt'
): string {
  const currentLang = useCurrentLanguage();
  
  // Memoize the result to avoid re-renders when inputs haven't changed
  return useMemo(() => {
    // Return empty string if no text
    if (!originalText) return '';
    
    // If current language is the same as source, return original immediately
    // This is the most common case (Portuguese users viewing Portuguese content)
    if (currentLang === sourceLang) {
      return originalText;
    }
    
    // For other languages, return original and trigger background translation
    // The translation will be handled by a separate effect that updates state
    return originalText;
  }, [originalText, currentLang, sourceLang]);
}

/**
 * Hook for background translation with state management
 * Use this when you need translation that updates asynchronously
 */
export function useAsyncTranslatedText(
  originalText: string | undefined | null,
  sourceLang: SupportedLanguage = 'pt'
): string {
  const currentLang = useCurrentLanguage();
  const [translatedText, setTranslatedText] = useState<string>(originalText || '');

  useEffect(() => {
    if (!originalText) {
      setTranslatedText('');
      return;
    }

    // If current language is the same as source, return original
    if (currentLang === sourceLang) {
      setTranslatedText(originalText);
      return;
    }

    // Start with original text, then translate in background
    setTranslatedText(originalText);

    let cancelled = false;

    translateText(originalText, currentLang, sourceLang)
      .then((translated) => {
        if (!cancelled) {
          setTranslatedText(translated);
        }
      })
      .catch((error) => {
        console.error('Translation error:', error);
        // Keep original text on error
      });

    return () => {
      cancelled = true;
    };
  }, [originalText, currentLang, sourceLang]);

  return translatedText;
}

/**
 * Hook to automatically translate multiple text strings
 * More efficient than calling useTranslatedText multiple times
 */
export function useTranslatedTexts(
  originalTexts: Array<string | undefined | null>,
  sourceLang: SupportedLanguage = 'pt'
): string[] {
  const currentLang = useCurrentLanguage();
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(
    originalTexts.map((t) => t || '')
  );

  // Memoize validTexts to avoid recreating on every render
  // Using join to create a stable dependency key
  const textsKey = originalTexts.join('|');
  const validTexts = useMemo(
    () => originalTexts.map((t) => t || ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textsKey]
  );

  useEffect(() => {
    // If current language is the same as source, return originals
    if (currentLang === sourceLang) {
      setTranslatedTexts(validTexts);
      return;
    }

    // Start with original texts, then translate in background
    setTranslatedTexts(validTexts);

    let cancelled = false;

    translateTexts(validTexts, currentLang, sourceLang)
      .then((translated) => {
        if (!cancelled) {
          setTranslatedTexts(translated);
        }
      })
      .catch((error) => {
        console.error('Batch translation error:', error);
        // Keep original texts on error
      });

    return () => {
      cancelled = true;
    };
  }, [validTexts, currentLang, sourceLang]);

  return translatedTexts;
}

/**
 * Hook to translate an object with multiple text fields
 * Useful for translating project/artwork objects
 */
export function useTranslatedObject<T extends Record<string, unknown>>(
  obj: T | undefined | null,
  fieldsToTranslate: Array<keyof T>,
  sourceLang: SupportedLanguage = 'pt'
): T | null {
  const currentLang = useCurrentLanguage();
  const [translatedObj, setTranslatedObj] = useState<T | null>(obj || null);

    // Memoize fieldsToTranslate to avoid effect re-runs on array identity changes
    // Convert array to stable string key for dependency comparison
    const fieldsToTranslateString = fieldsToTranslate.join(',');
  const fieldsKey = useMemo(
     () => fieldsToTranslateString,
     [fieldsToTranslateString]
  );

  useEffect(() => {
    if (!obj) {
      setTranslatedObj(null);
      return;
    }

    // If current language is the same as source, return original
    if (currentLang === sourceLang) {
      setTranslatedObj(obj);
      return;
    }

    // Start with original object
    setTranslatedObj(obj);

    // Extract texts to translate
    const textsToTranslate = fieldsToTranslate
      .map((field) => {
        const value = obj[field];
        return typeof value === 'string' ? value : '';
      })
      .filter(Boolean);

    if (textsToTranslate.length === 0) {
      return;
    }

    let cancelled = false;

    translateTexts(textsToTranslate, currentLang, sourceLang)
      .then((translated) => {
        if (!cancelled) {
          const newObj = { ...obj };
          fieldsToTranslate.forEach((field, index) => {
            if (typeof obj[field] === 'string') {
              // Safe cast since we verified the field is a string
              (newObj[field] as string) = translated[index];
            }
          });
          setTranslatedObj(newObj);
        }
      })
      .catch((error) => {
        console.error('Object translation error:', error);
        // Keep original object on error
      });

    return () => {
      cancelled = true;
    };
  }, [obj, currentLang, sourceLang, fieldsKey, fieldsToTranslate]);

  return translatedObj;
}
