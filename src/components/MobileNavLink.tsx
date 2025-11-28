import { Link, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import React from 'react';

interface MobileNavLinkProps {
  to: string;
  label: string;
  isActive: boolean;
  onClose: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, isActive, onClose }) => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  
  // Match the exit duration defined in Navbar.tsx (0.2s)
  const EXIT_DURATION_MS = 200; 

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 1. Trigger menu close (starts exit animation)
    onClose();

    // 2. Delay navigation to allow exit animation to complete
    if (prefersReducedMotion) {
      navigate(to);
    } else {
      setTimeout(() => {
        navigate(to);
      }, EXIT_DURATION_MS);
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`block w-full rounded-xl px-4 py-3 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        isActive
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'text-foreground hover:bg-muted/50'
      }`}
    >
      {label}
    </Link>
  );
};

export default MobileNavLink;