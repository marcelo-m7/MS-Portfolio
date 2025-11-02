import { motion, useReducedMotion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetadataBadgeProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  iconSize?: 'sm' | 'md';
}

export default function MetadataBadge({ 
  icon: Icon, 
  children, 
  className = '',
  iconSize = 'md'
}: MetadataBadgeProps) {
  const prefersReducedMotion = useReducedMotion();
  const iconSizeClass = iconSize === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  
  return (
    <motion.span
      className={`inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 ${className}`}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {Icon && <Icon className={iconSizeClass} aria-hidden />}
      {children}
    </motion.span>
  );
}
