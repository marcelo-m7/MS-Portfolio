import { useEffect, useRef, type MutableRefObject } from 'react';

export const useVisibilityController = (): MutableRefObject<boolean> => {
  const visibleRef = useRef(true);

  useEffect(() => {
    const handleVisibility = () => {
      visibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return visibleRef;
};