import { http, HttpResponse, delay } from 'msw';
import { incidentsStore, notesStore, type Incident, type Note } from './store';

type IncidentsListResponse = {
  items: Incident[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

const createNoteId = (): string => {
  return `NOTE-${Math.random().toString(16).slice(2)}`;
};

const applyFailAndSlow = (url: URL): Promise<void> => {
  const shouldFail = url.searchParams.get('fail') === '1';
  const shouldSlow = url.searchParams.get('slow') === '1';

  if (shouldFail) {
    throw new Error('MSW_FORCED_FAIL');
  }

  if (shouldSlow) {
    return delay(600);
  }

  return Promise.resolve();
};

const matchesQuery = (incident: Incident, query: string): boolean => {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) return true;

  return (
    incident.id.toLowerCase().includes(normalizedQuery) ||
    incident.title.toLowerCase().includes(normalizedQuery) ||
    incident.description.toLowerCase().includes(normalizedQuery)
  );
};

const sortIncidents = (items: Incident[], sort: string | null): Incident[] => {
  if (sort === 'newest') {
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  if (sort === 'oldest') {
    return [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  return items;
};

const paginate = <T>(
  items: T[],
  page: number,
  limit: number
): { pageItems: T[]; totalPages: number } => {
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * limit;
  const endIndex = startIndex + limit;

  return { pageItems: items.slice(startIndex, endIndex), totalPages };
};

// --------------------
// Handlers
// --------------------
export const handlers = [
  // GET /api/incidents?page&limit&query&status&priority&sort
  http.get('/api/incidents', async ({ request }) => {
    const url = new URL(request.url);

    try {
      await applyFailAndSlow(url);
    } catch {
      return HttpResponse.json({ message: 'Internal Server Error (forced)' }, { status: 500 });
    }

    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 10);

    const query = url.searchParams.get('query') ?? '';
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const sort = url.searchParams.get('sort');

    let filtered = incidentsStore.filter((incident) => matchesQuery(incident, query));

    if (status) filtered = filtered.filter((incident) => incident.status === status);
    if (priority) filtered = filtered.filter((incident) => incident.priority === priority);

    filtered = sortIncidents(filtered, sort);

    const { pageItems, totalPages } = paginate(filtered, page, limit);

    const response: IncidentsListResponse = {
      items: pageItems,
      page,
      limit,
      totalItems: filtered.length,
      totalPages,
    };

    return HttpResponse.json(response);
  }),

  // GET /api/incidents/:id
  http.get('/api/incidents/:id', async ({ request, params }) => {
    const url = new URL(request.url);

    try {
      await applyFailAndSlow(url);
    } catch {
      return HttpResponse.json({ message: 'Internal Server Error (forced)' }, { status: 500 });
    }

    const incidentId = String(params.id);
    const incident = incidentsStore.find((item) => item.id === incidentId);

    if (!incident) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    const incidentNotes = notesStore
      .filter((note) => note.incidentId === incidentId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return HttpResponse.json({ incident, notes: incidentNotes });
  }),

  // PATCH /api/incidents/:id (status/priority)
  http.patch('/api/incidents/:id', async ({ request, params }) => {
    const url = new URL(request.url);

    try {
      await applyFailAndSlow(url);
    } catch {
      return HttpResponse.json({ message: 'Internal Server Error (forced)' }, { status: 500 });
    }

    const incidentId = String(params.id);
    const incidentIndex = incidentsStore.findIndex((item) => item.id === incidentId);

    if (incidentIndex === -1) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    const body = (await request.json()) as Partial<Pick<Incident, 'status' | 'priority'>>;

    incidentsStore[incidentIndex] = {
      ...incidentsStore[incidentIndex],
      ...body,
    };

    return HttpResponse.json({ incident: incidentsStore[incidentIndex] });
  }),

  // POST /api/incidents/:id/notes
  http.post('/api/incidents/:id/notes', async ({ request, params }) => {
    const url = new URL(request.url);

    try {
      await applyFailAndSlow(url);
    } catch {
      return HttpResponse.json({ message: 'Internal Server Error (forced)' }, { status: 500 });
    }

    const incidentId = String(params.id);
    const incidentExists = incidentsStore.some((item) => item.id === incidentId);

    if (!incidentExists) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    const body = (await request.json()) as { message?: string };

    if (!body.message || body.message.trim().length === 0) {
      return HttpResponse.json(
        { message: 'Validation error: message is required' },
        { status: 400 }
      );
    }

    const newNote: Note = {
      id: createNoteId(),
      incidentId,
      message: body.message.trim(),
      createdAt: new Date().toISOString(),
    };

    notesStore.push(newNote);

    return HttpResponse.json({ note: newNote }, { status: 201 });
  }),
];
