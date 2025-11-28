import { Link, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import React from 'react';

interface MobileNavLinkProps {
  to: string;
  label: string;
  isActive: boolean;
  onClose: () => void;
  type?: 'internal' | 'external'; // Added type prop
  target?: string; // Added target prop for external links
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, isActive, onClose, type = 'internal', target }) => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  
  // Match the exit duration defined in Navbar.tsx (0.2s)
  const EXIT_DURATION_MS = 200; 

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    onClose(); // Always close the menu

    if (type === 'external') {
      // For external links, open in a new tab
      if (target === '_blank') {
        window.open(to, '_blank', 'noopener noreferrer');
      } else {
        window.location.href = to;
      }
    } else {
      // For internal links, delay navigation to allow exit animation to complete
      if (prefersReducedMotion) {
        navigate(to);
      } else {
        setTimeout(() => {
          navigate(to);
        }, EXIT_DURATION_MS);
      }
    }
  };

  return (
    <a // Changed from Link to <a> to handle both internal and external
      href={to}
      onClick={handleClick}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`block w-full rounded-xl px-4 py-3 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        isActive
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'text-foreground hover:bg-muted/50'
      }`}
    >
      {label}
    </a>
  );
};

export default MobileNavLink;