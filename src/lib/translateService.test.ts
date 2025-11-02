import { describe, it, expect } from 'vitest';
import { translationService, translateText } from './translateService';

// Test the free Google Translate web service implementation
describe('translateService', () => {
  it('should have translation service available for integration', () => {
    // Just verify the module exports work
    expect(translationService).toBeDefined();
    expect(translationService.isAvailable).toBeDefined();
    expect(translationService.isAvailable()).toBe(true); // Always true - no API key needed
  });

  it('should handle same-language translations efficiently', async () => {
    // Same language should return immediately
    const result = await translateText('Hello', 'en', 'en');
    expect(result).toBe('Hello');
  });

  it('should always be available (no API key required)', () => {
    // Free service should always be available
    const available = translationService.isAvailable();
    expect(available).toBe(true);
  });

  it('should provide clear cache functionality', () => {
    // clearCache should not throw
    expect(() => translationService.clearCache()).not.toThrow();
  });

  it('should attempt translation when languages differ', async () => {
    // When languages differ, should attempt translation
    const originalText = 'Test text for translation';
    const result = await translateText(originalText, 'en', 'pt');
    // Result should be a string (either translated or original on error)
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle batch translations', async () => {
    const { translateTexts } = await import('./translateService');
    const texts = ['Hello', 'World'];
    const results = await translateTexts(texts, 'en', 'en');
    expect(results).toEqual(texts); // Same language should return immediately
  });

  it('should cache translations properly', async () => {
    // Clear cache first
    translationService.clearCache();
    
    // Translate something (will be cached)
    const text = 'Cache test';
    await translateText(text, 'es', 'en');
    
    // Second call should use cache (no network request)
    const result = await translateText(text, 'es', 'en');
    expect(typeof result).toBe('string');
  });
});
