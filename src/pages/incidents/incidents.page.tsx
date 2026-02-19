import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';

import { api } from '@/shared/api';
import type { TIncidentsListResponse } from '@/shared/api/types/types';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { parsePositiveInteger } from '@/shared/utils/parse-positive-integer';

export const IncidentsPage = () => {
  const { params } = useQueryParams();

  const query = params.query;
  const status = params.status;
  const priority = params.priority;
  const sort = params.sort ?? 'newest';
  const page = parsePositiveInteger(params.page, '1');
  const limit = parsePositiveInteger(params.limit, '10');

  const incidentsQueryParameters = {
    query,
    status,
    priority,
    sort,
    page,
    limit,
  };

  const { data, isLoading, isError } = useQuery<TIncidentsListResponse | undefined>({
    queryKey: ['incidents', incidentsQueryParameters],
    queryFn: ({ signal }) =>
      api.getIncidents(
        incidentsQueryParameters,
        { signal }
      ),
  });
  if (isError) return <div>Something went wrong</div>;

  return (
    <div>
      <h1>Incidents</h1>
      {isLoading || !data ? (
        <div>Loading…</div>
      ) : (
        <ul>
          {data.items.map((incident) => (
            <Link to={`/incidents/${incident.id}`} key={incident.id}>
              {incident.title}
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};
