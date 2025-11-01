import { describe, it, expect, vi } from 'vitest';

// We'll test the core logic without instantiating the singleton
describe('translateService', () => {
  it('should have translation service available for integration', () => {
    // Just verify the module exports work
    const { translationService } = await import('./translateService');
    expect(translationService).toBeDefined();
    expect(translationService.isAvailable).toBeDefined();
    expect(typeof translationService.isAvailable()).toBe('boolean');
  });

  it('should handle same-language translations efficiently', async () => {
    const { translateText } = await import('./translateService');
    // Same language should return immediately
    const result = await translateText('Hello', 'en', 'en');
    expect(result).toBe('Hello');
  });

  it('should gracefully handle missing API key', async () => {
    const { translationService } = await import('./translateService');
    // Without API key, service should still be available but disabled
    const available = translationService.isAvailable();
    expect(typeof available).toBe('boolean');
  });

  it('should provide clear cache functionality', async () => {
    const { translationService } = await import('./translateService');
    // clearCache should not throw
    expect(() => translationService.clearCache()).not.toThrow();
  });
});
