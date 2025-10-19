'use client';

import { useMessages } from 'next-intl';

export function useFallbackKeys(): string[] {
  const messages = useMessages() as Record<string, unknown>;
  const meta = messages.__meta as { fallbackKeys?: string[] } | undefined;
  return meta?.fallbackKeys ?? [];
}
