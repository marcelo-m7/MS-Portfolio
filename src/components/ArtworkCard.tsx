import React from 'react';
import BaseCard, { CardThumbnail, CardContent, CardFooterLink } from '@/components/shared/BaseCard';

interface ArtworkCardProps {
  artwork: {
    slug: string;
    title: string;
    description: string;
    media: string[] | Array<{ media_url?: string | null }>;
    year: number;
    materials: string[] | Array<{ material?: string | null }>;
    url3d?: string;
  };
  index: number;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, index }) => {
  // Normalize media and materials to strings
  const mediaUrls = Array.isArray(artwork.media)
    ? artwork.media.map(m => typeof m === 'string' ? m : m.media_url).filter(Boolean) as string[]
    : [];
  const materials = Array.isArray(artwork.materials)
    ? artwork.materials.map(m => typeof m === 'string' ? m : m.material).filter(Boolean) as string[]
    : [];

  return (
    <BaseCard
      index={index}
      to={`/art/${artwork.slug}`}
      footer={
        artwork.url3d && (
          <CardFooterLink href={artwork.url3d} external>
            Ver Experiência 3D
          </CardFooterLink>
        )
      }
    >
      <CardThumbnail
        src={mediaUrls[0]}
        alt={`${artwork.title} – Arte Digital`}
        year={artwork.year}
      />
      <CardContent
        title={artwork.title}
        badge="Arte Digital"
        description={artwork.description}
      >
        {materials.map((material: string) => (
          <span
            key={material}
            className="text-xs px-3 py-1 rounded-xl bg-muted/60 text-foreground/80"
          >
            {material}
          </span>
        ))}
      </CardContent>
    </BaseCard>
  );
};

export default ArtworkCard;