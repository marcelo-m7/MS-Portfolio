import { Link, type LinkProps } from 'react-router-dom';
import { motion, useReducedMotion, type MotionProps } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedLinkProps extends LinkProps, MotionProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  tapScale?: number;
  hoverShadow?: string;
  transitionType?: 'spring' | 'tween';
  transitionStiffness?: number;
  transitionDamping?: number;
  transitionDuration?: number;
}

export const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  children,
  className,
  hoverScale = 1.05,
  tapScale = 0.95,
  hoverShadow,
  transitionType = 'spring',
  transitionStiffness = 300,
  transitionDamping = 20,
  transitionDuration = 0.2,
  ...rest
}) => {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: hoverScale, boxShadow: hoverShadow },
        whileTap: { scale: tapScale },
        transition: {
          type: transitionType,
          stiffness: transitionStiffness,
          damping: transitionDamping,
          duration: transitionDuration,
        },
      };

  return (
    <motion.custom
      as={Link}
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
      {...motionProps}
      {...rest}
    >
      {children}
    </motion.custom>
  );
};