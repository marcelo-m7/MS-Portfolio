import Link from 'next/link';
import { Mail, MessageCircle, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { createLocalizedMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n.config';

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  return {
    title: 'Contact',
    description: 'Vamos conversar sobre novas ideias, produtos e projetos.',
    ...createLocalizedMetadata(params.lang, '/contact'),
  };
}

export default async function ContactPage({ params }: { params: { lang: Locale } }) {
  const { lang } = params;
  const t = await getTranslations({ locale: lang, namespace: 'contact' });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8 space-y-3">
        <h1 className="text-4xl font-display font-bold">{t('title')}</h1>
        <p className="text-base text-muted-foreground">{t('description')}</p>
      </header>
      <div className="grid gap-6">
        <div className="rounded-2xl border border-border/70 bg-card/70 p-6">
          <div className="flex items-center gap-3 text-secondary">
            <Mail className="h-5 w-5" aria-hidden />
            <h2 className="text-lg font-semibold">{t('email.title')}</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t('email.description')}</p>
          <Button asChild className="mt-4 w-full sm:w-auto">
            <Link href="mailto:geral@monynha.com">{t('email.cta')}</Link>
          </Button>
        </div>
        <div className="rounded-2xl border border-secondary/60 bg-secondary/10 p-6">
          <div className="flex items-center gap-3 text-secondary">
            <MessageCircle className="h-5 w-5" aria-hidden />
            <h2 className="text-lg font-semibold">{t('chat.title')}</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t('chat.description')}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="https://linkedin.com/in/marcelo-m7" target="_blank" rel="noreferrer">
                {t('chat.linkedin')}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://github.com/marcelo-m7" target="_blank" rel="noreferrer">
                {t('chat.github')}
              </Link>
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-accent/60 bg-accent/10 p-6">
          <div className="flex items-center gap-3 text-accent">
            <Sparkles className="h-5 w-5" aria-hidden />
            <h2 className="text-lg font-semibold">{t('collab.title')}</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t('collab.description')}</p>
        </div>
      </div>
    </div>
  );
}
