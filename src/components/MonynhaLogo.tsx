import React from 'react';
import { motion } from 'framer-motion';

interface MonynhaLogoProps {
  size?: number;
  className?: string;
}

const MonynhaLogo: React.FC<MonynhaLogoProps> = ({ size = 24, className = '' }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.path
        d="M12 2L2 12L12 22L22 12L12 2Z"
        stroke="url(#paint0_linear_monynha)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
      />
      <motion.path
        d="M12 5L5 12L12 19L19 12L12 5Z"
        stroke="url(#paint1_linear_monynha)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
      />
      <defs>
        <linearGradient id="paint0_linear_monynha" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--primary))"/>
          <stop offset="1" stopColor="hsl(var(--secondary))"/>
        </linearGradient>
        <linearGradient id="paint1_linear_monynha" x1="12" y1="5" x2="12" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--secondary))"/>
          <stop offset="1" stopColor="hsl(var(--accent))"/>
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export default MonynhaLogo;