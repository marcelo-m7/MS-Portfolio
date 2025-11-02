import { motion, useReducedMotion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetadataBadgeProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export default function MetadataBadge({ icon: Icon, children, className = '' }: MetadataBadgeProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.span
      className={`inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 ${className}`}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden />}
      {children}
    </motion.span>
  );
}
