import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MotionButton = motion(Button);

interface BackButtonProps {
  to: string;
  label: string;
}

export default function BackButton({ to, label }: BackButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <MotionButton
      asChild
      variant="ghost"
      className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
      whileHover={prefersReducedMotion ? undefined : { x: -5 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link to={to}>
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {label}
      </Link>
    </MotionButton>
  );
}
