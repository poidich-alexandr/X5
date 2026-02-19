import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import { withSuspense } from '@/shared/utils/with-suspense';

const IncidentsPageLazy = lazy(() =>
  import('@/pages/incidents/incidents.page').then((module) => ({
    default: module.IncidentsPage,
  }))
);
const IncidentDetailsPageLazy = lazy(() =>
  import('@/pages/incident-details/incident-details.page').then((module) => ({
    default: module.IncidentDetailsPage,
  }))
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/incidents" replace />,
  },
  {
    path: '/incidents',
    element: withSuspense(<IncidentsPageLazy />),
  },
  {
    path: '/incidents/:id',
    element: withSuspense(<IncidentDetailsPageLazy />),
  },
]);
