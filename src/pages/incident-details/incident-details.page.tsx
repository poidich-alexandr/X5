import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { api } from '@/shared/api';
import type { IIncidentDetailsResponse } from '@/shared/api/types/server.types';
import { Dropdown } from '@/shared/ui/dropdown/dropdown';
import { getInitialDropdownOption } from '@/shared/utils/get-initial-dropdown-options';

import { priorityDetailOptions, statusDetailOptions } from './model/consts/incidents.consts';
import { isIncidentPriorityDTO, isIncidentStatusDTO } from './model/guards';
import { useDetailsMutation } from './model/useDetailsMutation';

export const IncidentDetailsPage = () => {
  const params = useParams();
  const incidentId = params.id as string;

  const incidentDetailsQueryKey = ['incident', incidentId] as const;

  const { data, isLoading, isError, error } = useQuery<IIncidentDetailsResponse>({
    queryKey: incidentDetailsQueryKey,
    queryFn: ({ signal }) => api.getIncidentDetails(incidentId!, { signal }),
    enabled: Boolean(incidentId),
  });

  const { updatePriorityMutation, updateStatusMutation } = useDetailsMutation({ incidentId });

  if (isError) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return <div>Not found</div>;
    }
    return <div>Something went wrong</div>;
  }

  if (isLoading || !data) return <div>Loading details…</div>;

  const handleStatusChange = (value: string) => {
    if (!isIncidentStatusDTO(value)) return;
    updateStatusMutation.mutate(value);
  };

  const handlePriorityChange = (value: string) => {
    if (!isIncidentPriorityDTO(value)) return;
    updatePriorityMutation.mutate(value);
  };

  return (
    <div>
      <h1>{data.incident.title}</h1>
      <p>{data.incident.description}</p>

      <div>
        <div>
          <span>Status:</span>{' '}
          <Dropdown
            key={data.incident.status} //чтобы rollback/optimistic всегда отражался в UI
            items={statusDetailOptions}
            initialOption={getInitialDropdownOption(statusDetailOptions, data.incident.status)}
            ariaLabel="status dropdown trigger"
            isDisabled={updateStatusMutation.isPending}
            onChange={(option) => handleStatusChange(option.value)}
          />
        </div>

        <div>
          <span>Priority:</span>{' '}
          <Dropdown
            key={data.incident.priority}
            items={priorityDetailOptions}
            initialOption={getInitialDropdownOption(priorityDetailOptions, data.incident.priority)}
            ariaLabel="priority dropdown trigger"
            isDisabled={updatePriorityMutation.isPending}
            onChange={(option) => handlePriorityChange(option.value)}
          />
        </div>
        <div>Reporter: {data.incident.reporter}</div>
      </div>

      <h2>Notes</h2>
      {data.notes.length ? (
        <ul>
          {data.notes.map((note) => (
            <li key={note.id}>{note.message}</li>
          ))}
        </ul>
      ) : (
        <div>No notes</div>
      )}
    </div>
  );
};
