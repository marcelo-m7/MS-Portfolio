/**
 * Google Translate Free Web Service integration for automatic content translation
 * Uses Google Translate's free web endpoint (no API key required)
 * Runs silently in the background, caches results for performance
 */

import type { SupportedLanguage } from './language';

const CACHE_KEY_PREFIX = 'monynha-translate-cache';
const CACHE_VERSION = '2.0'; // Updated version for new free service
// Google Translate free web endpoint
const TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single';

interface TranslationCache {
  version: string;
  translations: Record<string, string>; // cacheKey -> translatedText
}

interface TranslateRequest {
  text: string;
  targetLang: SupportedLanguage;
  sourceLang?: SupportedLanguage;
}

class TranslationService {
  private cache: TranslationCache;
  private pendingRequests: Map<string, Promise<string>> = new Map();

  constructor() {
    this.cache = this.loadCache();
  }

  private loadCache(): TranslationCache {
    try {
      const cached = localStorage.getItem(CACHE_KEY_PREFIX);
      if (cached) {
        const parsed = JSON.parse(cached) as TranslationCache;
        if (parsed.version === CACHE_VERSION) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error);
    }
    return { version: CACHE_VERSION, translations: {} };
  }

  private saveCache(): void {
    try {
      localStorage.setItem(CACHE_KEY_PREFIX, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save translation cache:', error);
    }
  }

  private getCacheKey(text: string, targetLang: string): string {
    // Use JSON.stringify to avoid collision issues with special characters
    return JSON.stringify({ text, targetLang });
  }

  private getCachedTranslation(text: string, targetLang: string): string | null {
    const cacheKey = this.getCacheKey(text, targetLang);
    return this.cache.translations[cacheKey] || null;
  }

  private setCachedTranslation(text: string, targetLang: string, translation: string): void {
    const cacheKey = this.getCacheKey(text, targetLang);
    this.cache.translations[cacheKey] = translation;
    this.saveCache();
  }

  /**
   * Translate text using Google Translate Free Web Service
   * Returns cached translation if available, otherwise makes request
   */
  async translate({
    text,
    targetLang,
    sourceLang = 'pt',
  }: TranslateRequest): Promise<string> {
    // Return original text if translating to the same language
    if (sourceLang === targetLang) {
      return text;
    }

    // Check cache first
    const cached = this.getCachedTranslation(text, targetLang);
    if (cached) {
      return cached;
    }

    // Check if there's already a pending request for this translation
    const requestKey = this.getCacheKey(text, targetLang);
    const pending = this.pendingRequests.get(requestKey);
    if (pending) {
      return pending;
    }

    // Make translation request
    const translationPromise = this.fetchTranslation(text, targetLang, sourceLang);
    this.pendingRequests.set(requestKey, translationPromise);

    try {
      const result = await translationPromise;
      this.setCachedTranslation(text, targetLang, result);
      return result;
    } catch (error) {
      console.error('Translation failed:', error);
      // Return original text on error
      return text;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  private async fetchTranslation(
    text: string,
    targetLang: string,
    sourceLang: string
  ): Promise<string> {
    // Build URL with query parameters for Google Translate free endpoint
    const params = new URLSearchParams({
      client: 'gtx',           // Google Translate Extension client
      sl: sourceLang,          // Source language
      tl: targetLang,          // Target language
      dt: 't',                 // Return translation
      q: text,                 // Text to translate
    });
    
    const url = `${TRANSLATE_ENDPOINT}?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Translation request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the response structure from Google Translate free API
    // Response format: [[[translated_text, original_text, null, null, confidence], ...], ...]
    if (Array.isArray(data) && data[0] && Array.isArray(data[0])) {
      const translations = data[0]
        .filter((item: unknown[]) => Array.isArray(item) && item[0])
        .map((item: unknown[]) => item[0] as string);
      
      if (translations.length > 0) {
        return translations.join('');
      }
    }
    
    // Fallback to original text if parsing fails
    return text;
  }

  /**
   * Translate multiple texts in batch (more efficient)
   */
  async translateBatch(
    texts: string[],
    targetLang: SupportedLanguage,
    sourceLang: SupportedLanguage = 'pt'
  ): Promise<string[]> {
    if (sourceLang === targetLang) {
      return texts;
    }

    const results: string[] = [];
    const textsToTranslate: Array<{ text: string; index: number }> = [];

    // Check cache for each text
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      const cached = this.getCachedTranslation(text, targetLang);
      if (cached) {
        results[i] = cached;
      } else {
        textsToTranslate.push({ text, index: i });
      }
    }

    // Translate remaining texts one by one
    // (Free endpoint doesn't support batch, but we can do it concurrently)
    if (textsToTranslate.length > 0) {
      try {
        const translations = await Promise.all(
          textsToTranslate.map(({ text }) =>
            this.translate({ text, targetLang, sourceLang })
          )
        );

        // Fill in results
        textsToTranslate.forEach(({ index }, i) => {
          results[index] = translations[i];
        });
      } catch (error) {
        console.error('Batch translation failed:', error);
        // Fill in missing translations with original text
        textsToTranslate.forEach(({ text, index }) => {
          results[index] = results[index] || text;
        });
      }
    }

    return results;
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache = { version: CACHE_VERSION, translations: {} };
    this.saveCache();
  }

  /**
   * Check if translation service is available
   * Free service is always available (no API key needed)
   */
  isAvailable(): boolean {
    return true;
  }
}

// Singleton instance
export const translationService = new TranslationService();

/**
 * Translate a single text string
 */
export async function translateText(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage = 'pt'
): Promise<string> {
  return translationService.translate({ text, targetLang, sourceLang });
}

/**
 * Translate multiple strings in batch
 */
export async function translateTexts(
  texts: string[],
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage = 'pt'
): Promise<string[]> {
  return translationService.translateBatch(texts, targetLang, sourceLang);
}
