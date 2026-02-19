import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createMemoryRouter, type RouteObject,RouterProvider } from 'react-router';

type TOptions = {
  entryRoute?: string;
  routes: RouteObject[];
};

export const renderWithProviders = (options: TOptions) => {
  const { entryRoute = '/', routes } = options;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // важно для тестов, чтобы не ждать лишние ретраи
      },
    },
  });

  const memoryRouter = createMemoryRouter(routes , {
    initialEntries: [entryRoute],
  });

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={memoryRouter} />
    </QueryClientProvider>
  );

  return { ...renderResult, queryClient, memoryRouter };
};

