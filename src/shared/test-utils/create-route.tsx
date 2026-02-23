import { Navigate, type RouteObject } from 'react-router';

import { GlobalErrorBoundary } from '@/app/router/global-error-boundary';
import { RootLayout } from '@/app/router/root-layout';

export const createTestRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      Component: RootLayout,
      errorElement: <GlobalErrorBoundary />,
      
      hydrateFallbackElement: <div>Loading…</div>,
      children: [
        {
          index: true,
          element: <Navigate to="/incidents" replace />,
        },
        {
          path: '/incidents',
          lazy: () =>
            import('@/pages/incidents/incidents.page').then((module) => ({
              Component: module.IncidentsPage,
            })),
        },
        {
          path: '/incidents/:id',
          lazy: () =>
            import('@/pages/incident-details/incident-details.page').then((module) => ({
              Component: module.IncidentDetailsPage,
            })),
        },
      ],
    },
  ];
};
