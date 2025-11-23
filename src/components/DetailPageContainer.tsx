import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface DetailPageContainerProps {
  children: ReactNode;
  maxWidth?: 'default' | 'large' | 'small';
  className?: string;
}

export default function DetailPageContainer({ 
  children, 
  maxWidth = 'default',
  className = '' 
}: DetailPageContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const maxWidthClass = {
    default: 'max-w-4xl',
    large: 'max-w-5xl',
    small: 'max-w-3xl'
  }[maxWidth];
  
  return (
    <div className="px-6">
      <div className={`container mx-auto ${maxWidthClass}`}>
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`rounded-[var(--radius)] border border-border/60 bg-card/80 p-10 shadow-[0_45px_90px_-70px_hsl(var(--primary)/0.3)] backdrop-blur-xl ${className}`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
