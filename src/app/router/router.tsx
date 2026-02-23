// import { createBrowserRouter, Navigate } from 'react-router';

// import { NotFoundPage } from '@/pages/not-found/not-found.page';

// import { GlobalErrorBoundary } from './global-error-boundary';
// import { RootLayout } from './root-layout';

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     Component: RootLayout,
//     errorElement: <GlobalErrorBoundary />,

//     children: [
//       {
//         index: true,
//         element: <Navigate to="/incidents" replace />,
//       },
//       {
//         path: '/incidents',
//         lazy: () =>
//           import('@/pages/incidents/incidents.page').then((module) => ({
//             Component: module.IncidentsPage,
//           })),
//       },
//       {
//         path: '/incidents/:id',
//         lazy: () =>
//           import('@/pages/incident-details/incident-details.page').then((module) => ({
//             Component: module.IncidentDetailsPage,
//           })),
//       },
//       {
//         path: "*",
//         element: <NotFoundPage />
//       }
//     ],
//   },
// ]);

import { createBrowserRouter, Navigate } from 'react-router';

import { NotFoundPage } from '@/pages/not-found/not-found.page';

import { GlobalErrorBoundary } from './global-error-boundary';
import { type IMetaHandle,RootLayout } from './root-layout';

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
        handle: {
          title: () => 'Incident Inbox — Incidents',
          description: () => 'List of incidents. Search, filter and triage.',
        } satisfies IMetaHandle,
      },
      {
        path: '/incidents/:id',
        lazy: () =>
          import('@/pages/incident-details/incident-details.page').then((module) => ({
            Component: module.IncidentDetailsPage,
          })),
        handle: {
          title: (params) => `Incident Inbox — ${params.id ?? 'Incident'}`,
          description: (params) =>
            `Incident details: status, priority and notes (${params.id ?? 'incident'}).`,
        } satisfies IMetaHandle,
      },
      {
        path: '*',
        element: <NotFoundPage />,
        handle: {
          title: () => 'Incident Inbox — 404',
          description: () => 'Page not found.',
        } satisfies IMetaHandle,
      },
    ],
  },
]);
