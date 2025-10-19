import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import React from 'react';

const MotionLink = motion(Link);

interface ArtworkCardProps {
  artwork: {
    slug: string;
    title: string;
    description: string;
    media: string[];
    year: number;
    materials: string[];
    url3d?: string;
  };
  index: number;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, index }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group"
    >
      <div className="rounded-2xl border border-border/70 bg-card/90 overflow-hidden shadow-md transition-shadow focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 focus-within:ring-offset-background group-hover:shadow-lg">
        <MotionLink
          to={`/art/${artwork.slug}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={
            prefersReducedMotion
              ? undefined
              : { rotateX: -6, rotateY: 6, translateZ: 12 }
          }
          whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20">
            <motion.img
              src={artwork.media?.[0]}
              width={640}
              height={360}
              loading="lazy"
              decoding="async"
              alt={`${artwork.title} – Arte Digital`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-4 right-4">
              <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium">
                {artwork.year}
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                {artwork.title}
              </h3>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap ml-2">
                Arte Digital
              </span>
            </div>

            <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
              {artwork.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {artwork.materials.map((material: string) => (
                <span
                  key={material}
                  className="text-xs px-3 py-1 rounded-xl bg-muted/60 text-foreground/80"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        </MotionLink>
        {artwork.url3d && (
          <div className="p-6 pt-0">
            <a
              href={artwork.url3d}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver Experiência 3D
              <ExternalLink size={16} aria-hidden />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ArtworkCard;