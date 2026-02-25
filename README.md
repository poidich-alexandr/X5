# Incident Inbox

Test assignment implementation - Incident management interface for Driver Operations.

---

## 🚀 Tech Stack

- React 19
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
- Note is saved with debounce to LocalStorage and cleared after successful note submission
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
- Empty state when no incidents match filters
- Error state when API request fails
- Unit tests for parsePositiveInteger utility

Run tests:

```bash
bun run test
```

---

## Linting

The project uses ESLint for static code analysis.

### Run linter

```bash
npm run eslint
```

---

## Development Debug Parameters

For development purposes, additional query parameters can be used to simulate network behavior via MSW.

These parameters can be added directly to the browser URL:

```
?slow=1
?fail=1
```

---

### `?slow=1`

Simulates a slow network response (~6000ms delay).

Examples:

```
/incidents?slow=1
/incidents/INC-1003?slow=1
```

---

### `?fail=1`

Forces the API request to return `500 Internal Server Error`.

Examples:

```
/incidents?fail=1
/incidents/INC-1003?fail=1
```

---

These parameters are automatically forwarded to API requests in development and handled by MSW.  
They are intended strictly for debugging and are not part of the production API contract.

---

## Run Locally

Install dependencies:

```bash
bun install
```

Start dev server:

```bash
bun run dev
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
    not-found/
  shared/
    api/
    hooks/
    lib/
    tes-utils/
    ui/
    utils/

```
