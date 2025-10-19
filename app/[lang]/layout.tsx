import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { localeNames, locales, rtlLocales, type Locale } from '@/i18n.config';
import LanguageSwitcher from '@/components/language-switcher';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { getMessages } from '@/lib/i18n/messages';

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const { lang } = params;
  if (!locales.includes(lang)) {
    notFound();
  }

  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `/${locale}`]),
  );

  return {
    title: 'MS Portfolio',
    description: 'Portfólio criativo e técnico de Marcelo Silva.',
    alternates: {
      canonical: `/${lang}`,
      languages,
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: Locale };
}) {
  const { lang } = params;
  if (!locales.includes(lang)) {
    notFound();
  }

  unstable_setRequestLocale(lang);
  const messages = await getMessages(lang);

  return (
    <html lang={lang} dir={rtlLocales.includes(lang) ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <NextIntlClientProvider locale={lang} messages={messages} timeZone="Europe/Lisbon">
            <div className="flex min-h-screen flex-col">
              <header className="border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                  <div className="text-lg font-semibold">MS Portfolio</div>
                  <LanguageSwitcher currentLocale={lang} />
                </div>
              </header>
              <main className="flex-1 bg-gradient-to-b from-background via-background to-background/70">
                {children}
              </main>
              <footer className="border-t border-border/60 bg-background/80">
                <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} Marcelo Silva. {localeNames[lang]}.
                </div>
              </footer>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
