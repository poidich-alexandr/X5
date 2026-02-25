import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { server } from '@/mocks/server';
import { createTestRoutes } from '@/shared/test-utils/create-test-routes';
import { renderWithProviders } from '@/shared/test-utils/render-with-provider';

import { IncidentsPage } from './incidents.page';

describe('IncidentsPage (MSW)', () => {
  it('renders loading then incidents list', async () => {
    renderWithProviders({
      entryRoute: '/incidents',
      routes: [{ path: '/incidents', element: <IncidentsPage /> }],
    });

    // 1) проверяю, что сначала есть лоадер
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // 2) затем жду реальные данные (из MSW)
    expect(await screen.findByText(/Damaged package/i)).toBeInTheDocument();
    expect(await screen.findByText(/Wrong address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Delivery delayed/i)).toBeInTheDocument();
  });
});

describe('IncidentsPage — URL sync', () => {
  it('pagination: Next updates page in URL', async () => {
    const user = userEvent.setup();

    const { memoryRouter } = renderWithProviders({
      entryRoute: '/incidents?page=1&limit=1',
      routes: createTestRoutes(),
    });

    // дождались загрузки списка
    expect(await screen.findByText('Incidents', {}, { timeout: 3000 })).toBeInTheDocument();

    // дождались именно блока пагинации
    expect(await screen.findByText(/Page 1 of/i)).toBeInTheDocument();
    // клик Next
    await user.click(screen.getByRole('button', { name: /next/i }));

    // URL обновился
    expect(memoryRouter.state.location.pathname).toBe('/incidents');
    expect(memoryRouter.state.location.search).toContain('page=2');
  });

  it('filters reset page=1 in URL when status changes', async () => {
    const user = userEvent.setup();

    const { memoryRouter } = renderWithProviders({
      routes: createTestRoutes(),
      entryRoute: '/incidents?page=1&limit=1',
    });

    expect(await screen.findByText('Incidents')).toBeInTheDocument();

    // Нахожу label "Status" и внутри statusTrigger
    const statusLabel = screen.getByText(/status/i).closest('label');
    expect(statusLabel).toBeTruthy();

    const statusTrigger = within(statusLabel as HTMLElement).getByRole('button', {
      name: 'status dropdown trigger',
    });
    // клик по тригеру + клик по resolved-option
    await user.click(statusTrigger);

    const listbox = within(statusLabel!).getByRole('listbox');
    const resolvedOption = within(listbox).getByRole('option', { name: /resolved/i });
    await user.click(resolvedOption);

    // Проверяю что page сбросился + статус записался в URL
    expect(memoryRouter.state.location.search).toContain('page=1');
    expect(memoryRouter.state.location.search).toContain('status=resolved');
  });

  it('search is debounced: URL updates only after delay', async () => {
    const user = userEvent.setup();

    const { memoryRouter } = renderWithProviders({
      routes: createTestRoutes(),
      entryRoute: '/incidents?page=1&limit=10',
    });

    expect(await screen.findByText('Incidents')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search by title/i);
    await user.type(searchInput, 'abc');

    await waitFor(() => {
      const searchParams = new URLSearchParams(memoryRouter.state.location.search);
      expect(searchParams.get('query')).toBe('abc');
    });

    const searchParams = new URLSearchParams(memoryRouter.state.location.search);

    expect(searchParams.get('page')).toBe('1');
  });
});

describe('IncidentsPage — empty state', () => {
  it('shows empty state when no incidents match filters', async () => {
    const user = userEvent.setup();

    renderWithProviders({
      entryRoute: '/incidents',
      routes: createTestRoutes(),
    });

    // Дождались загрузки
    expect(await screen.findByText('Incidents')).toBeInTheDocument();

    // Вводим заведомо несуществующий запрос
    const searchInput = screen.getByPlaceholderText(/search by title/i);
    await user.type(searchInput, 'zzzz-not-existing');

    // Ждём debounce + перерендер
    expect(await screen.findByText(/no incidents found/i)).toBeInTheDocument();
  });
});

describe('IncidentsPage — error state', () => {
  it('shows error state when API fails', async () => {
    server.use(
      http.get('/api/incidents', () => {
        return HttpResponse.json(
          { message: 'forced error' },
          { status: 500 }
        );
      })
    );

    renderWithProviders({
      entryRoute: '/incidents',
      routes: createTestRoutes(),
    });

    expect(
      await screen.findByText(/failed to load incidents/i)
    ).toBeInTheDocument();
  });
});
