import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api';

export const IncidentsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['incidents'],
    queryFn: ({ signal }) => api.getIncidents({ signal }),
  });
  if (isError) return <div>Something went wrong</div>;

  return (
    <div>
      <h1>Incidents</h1>
      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <ul>
          {data?.items.map((incident) => (
            <li key={incident.id}>{incident.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
