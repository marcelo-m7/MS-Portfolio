import { useEffect, useMemo, useState } from 'react';

const DEFAULT_TOKENS = ['--primary', '--secondary', '--accent'] as const;

const TOKEN_FALLBACKS: Record<string, string> = {
  '--primary': '240 60% 40%',
  '--secondary': '210 70% 50%',
  '--accent': '270 40% 60%',
};

const FALLBACK_COLOR = 'hsl(240, 60%, 40%)';

function formatToHsl(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/^(?:#|rgb|hsl)/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes('/')) {
    const [beforeSlash, alphaPart] = trimmed.split('/');
    const [h, s, l] = beforeSlash.trim().split(/\s+/);
    if (h && s && l && alphaPart) {
      return `hsla(${h}, ${s}, ${l}, ${alphaPart.trim()})`;
    }
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length >= 3) {
    const [h, s, l] = parts;
    return `hsl(${h}, ${s}, ${l})`;
  }

  return trimmed;
}

function readTokens(tokens: readonly string[]): string[] {
  const styles = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;

  return tokens.map(token => {
    const fromCss = styles?.getPropertyValue(token);
    const formatted = formatToHsl(fromCss);
    if (formatted) return formatted;

    const fallback = TOKEN_FALLBACKS[token];
    const formattedFallback = formatToHsl(fallback);
    return formattedFallback ?? FALLBACK_COLOR;
  });
}

function palettesEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function useThemePalette(tokens: readonly string[] = DEFAULT_TOKENS) {
  const tokenKey = useMemo(() => tokens.join('|'), [tokens]);
  const [palette, setPalette] = useState(() => readTokens(tokens));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updatePalette = () => {
      const next = readTokens(tokens);
      setPalette(prev => (palettesEqual(prev, next) ? prev : next));
    };

    updatePalette();

    const observer = new MutationObserver(() => updatePalette());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style'],
    });

    const mediaQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;
    const handleMediaChange = () => updatePalette();
    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleMediaChange);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleMediaChange);
      }
    }

    const handleThemeChange: EventListener = () => updatePalette();
    window.addEventListener('themechange', handleThemeChange);

    return () => {
      observer.disconnect();
      if (mediaQuery) {
        if (typeof mediaQuery.removeEventListener === 'function') {
          mediaQuery.removeEventListener('change', handleMediaChange);
        } else if (typeof mediaQuery.removeListener === 'function') {
          mediaQuery.removeListener(handleMediaChange);
        }
      }
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, [tokenKey, tokens]);

  return palette;
}

export type ThemePalette = ReturnType<typeof useThemePalette>;
