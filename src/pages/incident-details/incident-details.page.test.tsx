import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';

import { server } from '@/mocks/server';
import { createTestRoutes } from '@/shared/test-utils/create-test-routes';
import { renderWithProviders } from '@/shared/test-utils/render-with-provider';

describe('routing', () => {
  it('navigates from IncedentPage list to details', async () => {
    const user = userEvent.setup();
    renderWithProviders({
      entryRoute: '/incidents',
      routes: createTestRoutes(),
    });

    const idPill = await screen.findByText(/ID:\s*INC-1001/i, {}, { timeout: 5000 });
    const link = idPill.closest('a');

    expect(link).not.toBeNull();

    await user.click(link!);

    expect(await screen.findByText(/Status/i)).toBeInTheDocument();
  });
});

describe('IncidentDetailsPage — mutations', () => {
  it('adds note and renders it in the list', async () => {
    const user = userEvent.setup();

    renderWithProviders({
      entryRoute: '/incidents/INC-1001',
      routes: createTestRoutes(),
    });

    // дождались загрузки детальки
    expect(await screen.findByRole('heading', { name: /Description/i })).toBeInTheDocument();

    const textarea = screen.getByLabelText(/add note/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(textarea, 'my test text');
    await user.click(addButton);

    // note должен появиться в UI после POST + invalidate/refetch
    expect(await screen.findByText(/my test text/i)).toBeInTheDocument();

    // textarea в onSuccess чищу --> проверка
    expect(textarea).toHaveValue('');
  });
});

describe('IncidentDetailsPage — optimistic status', () => {
  it('rolls back status when update fails', async () => {
    const user = userEvent.setup();

    // PATCH падает
    server.use(
      http.patch('/api/incidents/:id', async () => {
        await delay(80); // даю TSQuery время отработать onMutate --> mutate --> onError
        return HttpResponse.json({ message: 'forced fail' }, { status: 500 });
      })
    );

    renderWithProviders({
      entryRoute: '/incidents/INC-1001',
      routes: createTestRoutes(),
    });

    await screen.findByRole('heading', { name: /Wrong address/i });
    await screen.findByText(/INC-1001/i);

    const statusTrigger = screen.getByRole('button', { name: /status dropdown trigger/i });
    expect(statusTrigger).toHaveTextContent(/in progress/i); //исходный статус для INC-1001 'in progress'

    // Открываею dropdown и выбираю другой статус ("resolved")
    await user.click(statusTrigger);
    const resolvedOption = await screen.findByRole('option', { name: /resolved/i });
    await user.click(resolvedOption);

    // Optimistic update
    expect(statusTrigger).toHaveTextContent(/resolved/i);

    // ищу ошибку в UI, и rollback
    await waitFor(
      () => {
        expect(screen.getByText(/Failed to update status/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /status dropdown trigger/i })).toHaveTextContent(
          /in progress/i
        );
      },
      { timeout: 6000, interval: 100 }
    );
  }, 15000);
});
