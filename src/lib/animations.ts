import { Variants } from 'framer-motion';

/**
 * Shared animation configurations to reduce duplication across components
 */

// Standard stagger container animation
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Standard item animation (used in stagger containers)
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};