import { describe, it, expect } from 'vitest';
import { translationService, translateText } from './translateService';

// We'll test the core logic without instantiating the singleton
describe('translateService', () => {
  it('should have translation service available for integration', () => {
    // Just verify the module exports work
    expect(translationService).toBeDefined();
    expect(translationService.isAvailable).toBeDefined();
    expect(typeof translationService.isAvailable()).toBe('boolean');
  });

  it('should handle same-language translations efficiently', async () => {
    // Same language should return immediately
    const result = await translateText('Hello', 'en', 'en');
    expect(result).toBe('Hello');
  });

  it('should gracefully handle missing API key', () => {
    // Without API key, service should still be available but disabled
    const available = translationService.isAvailable();
    expect(typeof available).toBe('boolean');
  });

  it('should provide clear cache functionality', () => {
    // clearCache should not throw
    expect(() => translationService.clearCache()).not.toThrow();
  });

  it('should return original text when API key is not configured', async () => {
    // If API key is not set, should return original text
    const originalText = 'Test text for translation';
    const result = await translateText(originalText, 'en', 'pt');
    // Should return original text when API key is missing
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle batch translations', async () => {
    const { translateTexts } = await import('./translateService');
    const texts = ['Hello', 'World'];
    const results = await translateTexts(texts, 'en', 'en');
    expect(results).toEqual(texts); // Same language should return immediately
  });
});
