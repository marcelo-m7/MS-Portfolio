import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import cvData from '@/data/cv.json';
import { createLocalizedMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n.config';

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  return {
    title: 'Portfolio',
    description: 'Seleção de produtos, plataformas e experimentos criativos.',
    ...createLocalizedMetadata(params.lang, '/portfolio'),
  };
}

export default async function PortfolioPage({ params }: { params: { lang: Locale } }) {
  const { lang } = params;
  const t = await getTranslations({ locale: lang, namespace: 'portfolio' });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 space-y-4">
        <h1 className="text-4xl font-display font-bold">{t('title')}</h1>
        <p className="text-base text-muted-foreground">{t('description')}</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        {cvData.projects.map((project) => (
          <article key={project.slug} className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/70 p-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{project.category}</p>
              <h2 className="mt-1 text-2xl font-display font-semibold">{project.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{project.summary}</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {project.stack.slice(0, 4).join(' · ')}
              </span>
              {project.url ? (
                <Button asChild size="sm" variant="ghost" className="gap-1 text-secondary">
                  <Link href={project.url} target="_blank" rel="noreferrer">
                    {t('visit')}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
