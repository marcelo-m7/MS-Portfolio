/**
 * Google Translate API integration for automatic content translation
 * Runs silently in the background, caches results for performance
 */

import type { SupportedLanguage } from './language';

const CACHE_KEY_PREFIX = 'monynha-translate-cache';
const CACHE_VERSION = '1.0';
const API_ENDPOINT = 'https://translation.googleapis.com/language/translate/v2';

interface TranslationCache {
  version: string;
  translations: Record<string, Record<string, string>>; // sourceText -> targetLang -> translatedText
}

interface TranslateRequest {
  text: string;
  targetLang: SupportedLanguage;
  sourceLang?: SupportedLanguage;
}

interface TranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

class TranslationService {
  private cache: TranslationCache;
  private apiKey: string | null = null;
  private pendingRequests: Map<string, Promise<string>> = new Map();

  constructor() {
    this.cache = this.loadCache();
    this.apiKey = this.getApiKey();
  }

  private getApiKey(): string | null {
    // Try to get API key from environment variable
    const key = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    if (!key) {
      console.warn('Google Translate API key not configured. Translation will be disabled.');
      return null;
    }
    return key;
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
   * Translate text using Google Translate API
   * Returns cached translation if available, otherwise makes API call
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

    // Return original if no API key
    if (!this.apiKey) {
      return text;
    }

    // Check if there's already a pending request for this translation
    const requestKey = this.getCacheKey(text, targetLang);
    const pending = this.pendingRequests.get(requestKey);
    if (pending) {
      return pending;
    }

    // Make API call
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
    const url = `${API_ENDPOINT}?key=${this.apiKey!}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: sourceLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as TranslateResponse;
    return data.data.translations[0]?.translatedText || text;
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

    // Translate remaining texts
    if (textsToTranslate.length > 0 && this.apiKey) {
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
    } else if (textsToTranslate.length > 0) {
      // No API key, use original texts
      textsToTranslate.forEach(({ text, index }) => {
        results[index] = text;
      });
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
   */
  isAvailable(): boolean {
    return this.apiKey !== null;
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
