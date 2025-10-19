import { describe, expect, it } from 'vitest';

import { formatCurrency, formatDate, formatNumber, withFallback } from '@/lib/i18n/format';

describe('i18n format utilities', () => {
  it('formats dates with locale aware month names', () => {
    const formatted = formatDate('fr', '2024-07-01T00:00:00.000Z');
    expect(formatted.toLowerCase()).toContain('juillet');
  });

  it('formats numbers according to locale', () => {
    expect(formatNumber('es', 1234.56)).toBe('1234,56');
  });

  it('formats currency with symbol', () => {
    const formatted = formatCurrency('en', 1999.99);
    expect(formatted).toMatch(/€|EUR/);
  });

  it('falls back to default locale when formatter throws', () => {
    const result = withFallback('fr', (locale) => {
      if (locale === 'fr') {
        throw new Error('boom');
      }
      return locale;
    });

    expect(result).toBe('pt-PT');
  });
});
