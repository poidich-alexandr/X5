import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createTestRoutes } from '@/shared/test-utils/create-test-routes';
import { renderWithProviders } from '@/shared/test-utils/render-with-provider';

describe('routing', () => {
  it('navigates from IncedentPage list to details', async () => {
    const user = userEvent.setup();
    renderWithProviders({
      entryRoute: '/incidents',
      routes: createTestRoutes(),
    });

    const idPill = await screen.findByText(/ID:\s*INC-1001/i);
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
