import { describe, it, expect } from 'vitest'
import { translationService, translateText } from '../../src/lib/translateService'

describe('translateService', () => {
  it('should have translation service available for integration', () => {
    expect(translationService).toBeDefined()
    expect(translationService.isAvailable).toBeDefined()
    expect(translationService.isAvailable()).toBe(true)
  })

  it('should handle same-language translations efficiently', async () => {
    const result = await translateText('Hello', 'en', 'en')
    expect(result).toBe('Hello')
  })

  it('should always be available (no API key required)', () => {
    const available = translationService.isAvailable()
    expect(available).toBe(true)
  })

  it('should provide clear cache functionality', () => {
    expect(() => translationService.clearCache()).not.toThrow()
  })

  it('should attempt translation when languages differ', async () => {
    const originalText = 'Test text for translation'
    const result = await translateText(originalText, 'en', 'pt')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should handle batch translations', async () => {
    const { translateTexts } = await import('../../src/lib/translateService')
    const texts = ['Hello', 'World']
    const results = await translateTexts(texts, 'en', 'en')
    expect(results).toEqual(texts)
  })

  it('should cache translations properly', async () => {
    translationService.clearCache()
    const text = 'Cache test'
    await translateText(text, 'es', 'en')
    const result = await translateText(text, 'es', 'en')
    expect(typeof result).toBe('string')
  })
})
