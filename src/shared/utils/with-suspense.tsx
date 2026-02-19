import { type ReactNode, Suspense } from 'react';

export const withSuspense = (element: ReactNode, fallback?: ReactNode) => {
  return <Suspense fallback={fallback ?? '...Loading'}>{element}</Suspense>;
};
