import { motion, useReducedMotion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetadataBadgeProps {
  /**
   * The icon to display
   */
  icon: LucideIcon;
  /**
   * The content to display in the badge
   */
  children: React.ReactNode;
  /**
   * Optional className for additional styling
   */
  className?: string;
}

/**
 * Reusable metadata badge with icon used across detail pages
 */
export default function MetadataBadge({ icon: Icon, children, className = '' }: MetadataBadgeProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1',
        className
      )}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {children}
    </motion.span>
  );
}
