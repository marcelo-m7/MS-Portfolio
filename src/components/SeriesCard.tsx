import { Layers } from 'lucide-react';
import React from 'react';
import BaseCard, { CardThumbnail, CardContent, CardFooterLink } from '@/components/shared/BaseCard';

interface SeriesCardProps {
  series: {
    slug: string;
    title: string;
    description: string;
    year: number;
    works: string[] | Array<{ work_slug?: string | null }>;
  };
  index: number;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, index }) => {
  // Normalize works to string array
  const worksCount = Array.isArray(series.works)
    ? series.works.map(w => typeof w === 'string' ? w : w.work_slug).filter(Boolean).length
    : 0;

  return (
    <BaseCard
      index={index}
      to={`/series/${series.slug}`}
      footer={
        <CardFooterLink href={`/series/${series.slug}`}>
          Ver Coleção Completa
        </CardFooterLink>
      }
    >
      <CardThumbnail year={series.year} alt={`Série ${series.title}`}>
        <Layers className="h-24 w-24 text-white/50" aria-hidden />
      </CardThumbnail>
      <CardContent
        title={series.title}
        badge="Série Criativa"
        description={series.description}
      >
        {worksCount > 0 && (
          <span className="text-xs px-3 py-1 rounded-xl bg-muted/60 text-foreground/80">
            {worksCount} obras
          </span>
        )}
      </CardContent>
    </BaseCard>
  );
};

export default SeriesCard;