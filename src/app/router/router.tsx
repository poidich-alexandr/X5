import { createBrowserRouter, Navigate } from 'react-router';

import { GlobalErrorBoundary } from './global-error-boundary';
import { RootLayout } from './root-layout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    errorElement: <GlobalErrorBoundary />,
    
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
]);
