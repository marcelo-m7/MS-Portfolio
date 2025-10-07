import { useMemo } from 'react';

export const useThemeColor = (variable: string) =>
  useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

    return value ? `hsl(${value})` : '';
  }, [variable]);
