import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import React from 'react';

const MotionLink = motion(Link);

interface BaseCardProps {
  /**
   * Index for staggered animations
   */
  index: number;
  /**
   * Path to navigate to
   */
  to: string;
  /**
   * Content to render inside the card
   */
  children: React.ReactNode;
  /**
   * Optional footer content (e.g., external link)
   */
  footer?: React.ReactNode;
}

/**
 * Reusable base card component with consistent animation and styling
 * Used by ArtworkCard and SeriesCard
 */
export default function BaseCard({ index, to, children, footer }: BaseCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group h-full flex flex-col"
    >
      <div className="rounded-2xl border border-border/70 bg-card/90 overflow-hidden shadow-md transition-shadow focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 focus-within:ring-offset-background group-hover:shadow-lg flex flex-col h-full">
        <MotionLink
          to={to}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background flex-1 flex flex-col"
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={
            prefersReducedMotion
              ? undefined
              : { rotateX: -6, rotateY: 6, translateZ: 12 }
          }
          whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
          {children}
        </MotionLink>
        {footer}
      </div>
    </motion.div>
  );
}

interface CardThumbnailProps {
  /**
   * Image source URL
   */
  src?: string;
  /**
   * Alt text for the image
   */
  alt: string;
  /**
   * Year to display in badge
   */
  year: number;
  /**
   * Optional children to render instead of image (e.g., icon)
   */
  children?: React.ReactNode;
}

/**
 * Card thumbnail section with year badge
 */
export function CardThumbnail({ src, alt, year, children }: CardThumbnailProps) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 flex items-center justify-center flex-none">
      {children || (
        <img
          src={src}
          loading="lazy"
          decoding="async"
          alt={alt}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.error(`Failed to load image: ${src}`);
            target.style.display = 'none';
          }}
        />
      )}
      <div className="absolute top-4 right-4">
        <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium">
          {year}
        </span>
      </div>
    </div>
  );
}

interface CardContentProps {
  /**
   * Card title
   */
  title: string;
  /**
   * Badge label (e.g., "Arte Digital", "Série Criativa")
   */
  badge: string;
  /**
   * Card description
   */
  description: string;
  /**
   * Optional children to render at the bottom (e.g., tags, materials)
   */
  children?: React.ReactNode;
}

/**
 * Card content section with title, badge, and description
 */
export function CardContent({ title, badge, description, children }: CardContentProps) {
  return (
    <div className="p-6 flex flex-col gap-4 flex-1">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors flex-1 min-w-0 line-clamp-2">
          {title}
        </h3>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap flex-none">
          {badge}
        </span>
      </div>

      <p className="text-muted-foreground flex-1 text-sm leading-relaxed line-clamp-3">
        {description}
      </p>

      {children && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {children}
        </div>
      )}
    </div>
  );
}

interface CardFooterLinkProps {
  /**
   * Link URL (can be internal or external)
   */
  href: string;
  /**
   * Link text
   */
  children: React.ReactNode;
  /**
   * Whether this is an external link
   */
  external?: boolean;
}

/**
 * Card footer with link
 */
export function CardFooterLink({ href, children, external = false }: CardFooterLinkProps) {
  const Component = external ? 'a' : Link;
  const linkProps = external ? {
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
  } as const : {
    to: href,
  } as const;
  
  return (
    <div className="p-6 pt-0 flex-none">
      <Component
        {...linkProps}
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {children}
        <ExternalLink size={16} aria-hidden />
      </Component>
    </div>
  );
}
