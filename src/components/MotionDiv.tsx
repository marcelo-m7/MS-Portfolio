import { motion, useReducedMotion, type MotionProps } from 'framer-motion';
import React from 'react';

interface MotionDivProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  scaleFrom?: number;
  whileHoverScale?: number;
  whileTapScale?: number;
  boxShadowHover?: string;
}

export const MotionDiv: React.FC<MotionDivProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  xOffset = 0,
  scaleFrom = 1,
  whileHoverScale,
  whileTapScale,
  boxShadowHover,
  ...rest
}) => {
  const prefersReducedMotion = useReducedMotion();

  const initialProps = prefersReducedMotion
    ? undefined
    : { opacity: 0, y: yOffset, x: xOffset, scale: scaleFrom };
  const animateProps = prefersReducedMotion
    ? undefined
    : { opacity: 1, y: 0, x: 0, scale: 1 };
  const transitionProps = prefersReducedMotion
    ? undefined
    : { delay, duration, type: 'spring', stiffness: 260, damping: 30 };

  const hoverProps = prefersReducedMotion
    ? undefined
    : {
        scale: whileHoverScale,
        boxShadow: boxShadowHover,
      };
  const tapProps = prefersReducedMotion
    ? undefined
    : { scale: whileTapScale };

  return (
    <motion.div
      initial={initialProps}
      animate={animateProps}
      transition={transitionProps}
      whileHover={hoverProps}
      whileTap={tapProps}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};