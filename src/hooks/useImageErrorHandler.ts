import { SyntheticEvent } from 'react';

/**
 * Hook to handle image loading errors consistently across the app.
 * Hides the image and logs errors only in development mode.
 */
export function useImageErrorHandler() {
  return (e: SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const src = target.src;
    
    // Only log errors in development to reduce console noise
    if (import.meta.env.DEV) {
      console.error(`Failed to load image: ${src}`);
    }
    
    target.style.display = 'none';
  };
}
