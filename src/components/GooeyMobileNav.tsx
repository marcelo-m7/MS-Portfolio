import React, { useMemo } from 'react';
import GooeyNav from 'react-bits'; // Corrected import path
import { useLocation } from 'react-router-dom';
import { Home, FolderKanban, User, BookText, Mail } from 'lucide-react';

interface GooeyMobileNavProps {
  navLinks: Array<{ href: string; label: string }>;
}

const iconMap: Record<string, React.ElementType> = {
  '/': Home,
  '/portfolio': FolderKanban,
  '/about': User,
  '/thoughts': BookText,
  '/contact': Mail,
};

export default function GooeyMobileNav({ navLinks }: GooeyMobileNavProps) {
  const location = useLocation();

  const items = useMemo(() => {
    return navLinks.map((link) => ({
      label: link.label,
      href: link.href,
      icon: iconMap[link.href] || Home, // Fallback to Home icon
    }));
  }, [navLinks]);

  const initialActiveIndex = useMemo(() => {
    const index = items.findIndex(item => item.href === location.pathname);
    return index !== -1 ? index : 0; // Default to home if no match
  }, [items, location.pathname]);

  return (
    <div className="relative h-[80px] w-full flex items-center justify-center">
      <GooeyNav
        items={items}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        initialActiveIndex={initialActiveIndex}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]} // Using default colors, can be customized
        className="w-full max-w-md mx-auto"
      />
    </div>
  );
}