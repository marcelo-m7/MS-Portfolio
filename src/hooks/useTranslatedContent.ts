import { useEffect, useState, useMemo } from 'react';
import { useCurrentLanguage } from './useCurrentLanguage';
import { translateText, translateTexts } from '@/lib/translateService';
import type { SupportedLanguage } from '@/lib/language';

/**
 * Hook to automatically translate a single text string
 * Updates when language changes
 */
export function useTranslatedText(
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

  // Memoize fieldsToTranslate key to avoid effect re-runs
  // Using join to create a stable dependency key
  const fieldsKey = useMemo(
    () => fieldsToTranslate.join(','),
    [fieldsToTranslate.join(',')]
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
