import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n.config';

export default async function NotFound({ params }: { params: { lang: Locale } }) {
  const t = await getTranslations({ locale: params.lang, namespace: 'notFound' });

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-5xl font-display font-bold">{t('title')}</h1>
      <p className="max-w-xl text-base text-muted-foreground">{t('description')}</p>
      <Button asChild size="lg">
        <Link href={`/${params.lang}`}>{t('cta')}</Link>
      </Button>
    </div>
  );
}
