import { useEffect, useState } from 'react';

export function useAdaptive(width: number) {
  const query = `(max-width: ${width}px)`;
  const [isBreakpoint, setIsBreakpoint] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryAPI: MediaQueryList = window.matchMedia(query);

    const handleResize = (event: MediaQueryListEvent) => {
      setIsBreakpoint(event.matches);
    };

    mediaQueryAPI.addEventListener('change', handleResize);

    return () => mediaQueryAPI.removeEventListener('change', handleResize);
  }, [query]);

  return isBreakpoint;
}
