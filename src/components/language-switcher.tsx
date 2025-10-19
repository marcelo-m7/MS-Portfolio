'use client';

import { Check, Languages } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import React from 'react';

import { localeNames, locales, type Locale } from '../../i18n.config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

function getNextPathname(pathname: string | null, locale: Locale) {
  const segments = (pathname ?? '/').split('/').filter(Boolean);
  const [, ...rest] = segments;
  const next = rest.length ? `/${rest.join('/')}` : '';
  return `/${locale}${next}`;
}

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('languageSwitcher');
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (locale: Locale) => {
    if (locale === currentLocale) return;
    const nextPath = getNextPathname(pathname, locale);
    startTransition(() => {
      document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; sameSite=Lax`;
      router.replace(nextPath);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={t('ariaLabel', { locale: localeNames[currentLocale] })}
          data-pending={isPending}
          className={cn('gap-2 transition-opacity data-[pending=true]:opacity-60')}
        >
          <Languages className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={(event) => {
              event.preventDefault();
              handleLocaleChange(locale);
            }}
            className="flex items-center justify-between"
            aria-current={locale === currentLocale}
          >
            <span>{localeNames[locale]}</span>
            {locale === currentLocale ? <Check aria-hidden className="h-4 w-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
