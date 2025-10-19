'use client';

import { AlertCircle } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { useFallbackKeys } from '@/hooks/use-fallback-messages';
import { useTranslations } from 'next-intl';

export default function FallbackAlert() {
  const fallbackKeys = useFallbackKeys();
  const t = useTranslations('fallback');

  if (fallbackKeys.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-secondary/50 bg-secondary/10 p-4 text-sm text-secondary-foreground">
      <Badge variant="secondary" className="gap-1 bg-secondary text-secondary-foreground">
        <AlertCircle className="h-4 w-4" aria-hidden />
        {t('badge')}
      </Badge>
      <span className="text-muted-foreground">
        {t('description', { count: fallbackKeys.length })}
      </span>
    </div>
  );
}
