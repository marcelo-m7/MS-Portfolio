import { defaultLocale, type Locale } from '../../../i18n.config';

const currency = 'EUR';

export function formatDate(locale: Locale, date: Date | string): string {
  const safeDate = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(safeDate);
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCurrency(locale: Locale, value: number, currencyCode: string = currency): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'symbol',
  }).format(value);
}

export function withFallback<T>(
  locale: Locale,
  callback: (locale: Locale) => T,
  fallbackLocale: Locale = defaultLocale,
): T {
  try {
    return callback(locale);
  } catch (error) {
    console.warn(`Formatter failed for locale "${locale}". Falling back to ${fallbackLocale}.`, error);
    return callback(fallbackLocale);
  }
}
