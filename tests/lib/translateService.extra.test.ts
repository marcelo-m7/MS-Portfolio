import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const successResponse = (translated: string, original: string) => ({
  ok: true,
  json: async () => [[[translated, original, null, null, 1]]],
}) as Response

const malformedResponse = () => ({
  ok: true,
  json: async () => ({}),
}) as Response

const errorResponse = () => ({
  ok: false,
  status: 500,
  statusText: 'Server Error',
}) as Response

describe('translateService - caching, dedupe and errors', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('deduplicates concurrent requests for the same text/target', async () => {
    const fetchSpy = vi
      .spyOn(globalThis as unknown as { fetch: typeof fetch }, 'fetch')
      .mockResolvedValue(successResponse('Hola', 'Hello'))

    const { translateText, translationService } = await import('../../src/lib/translateService')
    translationService.clearCache()

    const p1 = translateText('Hello', 'es', 'en')
    const p2 = translateText('Hello', 'es', 'en')

    const [r1, r2] = await Promise.all([p1, p2])
    expect(r1).toBe('Hola')
    expect(r2).toBe('Hola')
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('returns original text and does not cache when the request fails (non-ok)', async () => {
    const fetchSpy = vi
      .spyOn(globalThis as unknown as { fetch: typeof fetch }, 'fetch')
      .mockResolvedValue(errorResponse())

    const { translateText, translationService } = await import('../../src/lib/translateService')
    translationService.clearCache()

    const original = 'Hello'
    const result = await translateText(original, 'es', 'en')
    expect(result).toBe(original)
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const result2 = await translateText(original, 'es', 'en')
    expect(result2).toBe(original)
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('falls back to original text on malformed JSON and caches that fallback', async () => {
    const fetchSpy = vi
      .spyOn(globalThis as unknown as { fetch: typeof fetch }, 'fetch')
      .mockResolvedValue(malformedResponse())

    const { translateText, translationService } = await import('../../src/lib/translateService')
    translationService.clearCache()

    const original = 'Hello'
    const result = await translateText(original, 'es', 'en')
    expect(result).toBe(original)
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const result2 = await translateText(original, 'es', 'en')
    expect(result2).toBe(original)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('clearCache resets stored translations', async () => {
    const fetchSpy = vi
      .spyOn(globalThis as unknown as { fetch: typeof fetch }, 'fetch')
      .mockResolvedValue(successResponse('Hola', 'Hello'))

    const { translateText, translationService } = await import('../../src/lib/translateService')
    translationService.clearCache()

    await translateText('Hello', 'es', 'en')
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    await translateText('Hello', 'es', 'en')
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    translationService.clearCache()
    await translateText('Hello', 'es', 'en')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })
})
