import Link from 'next/link';
import { ArrowRight, Calendar, Rocket } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import FallbackAlert from '@/components/fallback-alert';
import { Button } from '@/components/ui/button';
import cvData from '@/data/cv.json';
import { formatCurrency, formatDate, formatNumber } from '@/lib/i18n/format';
import type { Locale } from '@/i18n.config';

const startedAt = new Date('2012-01-01');

export default async function HomePage({ params }: { params: { lang: Locale } }) {
  const { lang } = params;
  const t = await getTranslations({ locale: lang, namespace: 'home' });
  const statsT = await getTranslations({ locale: lang, namespace: 'stats' });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-12">
      <section className="rounded-3xl border border-border/70 bg-card/70 p-10 shadow-xl shadow-secondary/10 backdrop-blur">
        <div className="flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-secondary/50 bg-secondary/10 px-4 py-1 text-sm font-medium text-secondary-foreground">
            <Calendar className="h-4 w-4" aria-hidden />
            {t('eyebrow', { location: cvData.profile.location })}
          </span>
          <h1 className="text-4xl font-display font-bold sm:text-5xl">{t('title', { name: cvData.profile.name })}</h1>
          <p className="text-lg text-muted-foreground">{t('subtitle', { headline: cvData.profile.headline })}</p>
          <p className="text-base leading-relaxed text-muted-foreground/90">{t('bio')}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href={`/${lang}/portfolio`}>
                {t('ctaPrimary')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/${lang}/contact`}>{t('ctaSecondary')}</Link>
            </Button>
          </div>
        </div>
        <FallbackAlert />
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {cvData.projects.slice(0, 2).map((project) => (
          <article
            key={project.slug}
            className="flex flex-col rounded-2xl border border-border/70 bg-background/60 p-6 shadow-md transition hover:-translate-y-1 hover:border-secondary/60 hover:shadow-lg"
          >
            <h2 className="text-2xl font-display font-semibold">{project.name}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{project.summary}</p>
            <div className="mt-auto flex items-center justify-between pt-6 text-sm text-muted-foreground/90">
              <span>{project.category}</span>
              <span className="font-medium text-secondary">{project.stack.slice(0, 3).join(' · ')}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 rounded-3xl border border-border/60 bg-card/60 p-8 sm:grid-cols-3">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-muted-foreground/80">{statsT('experience.label')}</p>
          <p className="text-3xl font-display font-semibold text-secondary">
            {formatNumber(lang, (new Date().getFullYear() - startedAt.getFullYear()))}+
          </p>
          <p className="text-sm text-muted-foreground">{statsT('experience.value')}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-muted-foreground/80">{statsT('clients.label')}</p>
          <p className="text-3xl font-display font-semibold text-secondary">
            {formatNumber(lang, cvData.projects.length)}
          </p>
          <p className="text-sm text-muted-foreground">{statsT('clients.value')}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-muted-foreground/80">{statsT('investment.label')}</p>
          <p className="text-3xl font-display font-semibold text-secondary">
            {formatCurrency(lang, 250000)}
          </p>
          <p className="text-sm text-muted-foreground">{statsT('investment.value', { date: formatDate(lang, startedAt) })}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-primary/50 bg-primary/10 p-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <Rocket className="h-8 w-8 text-primary" aria-hidden />
          <h2 className="text-3xl font-display font-bold">{t('ctaSection.title')}</h2>
          <p className="max-w-2xl text-base text-muted-foreground">{t('ctaSection.description')}</p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href={`/${lang}/contact`}>
              {t('ctaSection.button')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
