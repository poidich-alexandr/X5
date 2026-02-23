# Incident Inbox

Test assignment implementation - Incident management interface for Driver Operations.

---

## 🚀 Tech Stack

- React 18
- TypeScript
- React Router (Data Router API)
- TanStack Query
- MSW (Mock Service Worker)
- Vitest + React Testing Library
- SCSS Modules
- Bun

---

## Features

### Incidents List (`/incidents`)

- Server-side pagination
- Search with debounce
- Filtering by status and priority
- Sorting (newest / oldest)
- URL query params sync (Back/Forward supported)
- Active filters summary bar
- Accessible custom Dropdown component

### Incident Details (`/incidents/:id`)

- Incident info view
- Change status (optimistic update + rollback on error)
- Change priority
- Add notes
- Global route-level error boundary

---

## Key Implementation Notes

### Query Keys Strategy

```ts
['incidents', { query, status, priority, sort, page, limit }][('incident', id)];
```

Changing any parameter automatically triggers refetch.

---

### Optimistic Update (Status)

- `onMutate` --> update cache immediately
- `onError` --> rollback to previous state
- `onSettled` --> invalidate details query

---

### URL Synchronization

All filters, sorting, pagination and search are stored in query params.  
Back/Forward navigation restores state correctly.

---

### MSW

Used both:

- in browser (development)
- in node (tests)

Handlers include:

- `GET /api/incidents`
- `GET /api/incidents/:id`
- `PATCH /api/incidents/:id`
- `POST /api/incidents/:id/notes`

---

## Tests

Covered scenarios:

- List rendering with loading → data transition (MSW-backed)
- URL synchronization (pagination, filter reset, debounced search)
- Navigation from list to details page
- Add note mutation with UI update
- Optimistic status update with rollback on error

Run tests:

```bash
bun test
```

---

## Run Locally

Install dependencies:

```bash
bun install
```

Start dev server:

```bash
bun dev
```

Build:

```bash
bun run build
```

---

## Project Structure (simplified)

```
src/
  app/
  mocks/
  pages/
    incidents/
    incident-details/
  shared/
    api/
    hooks/
    ui/
    utils/

```
