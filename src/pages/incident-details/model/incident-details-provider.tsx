import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useParams } from 'react-router';

import { api } from '@/shared/api';
import type { IIncidentDetailsResponse } from '@/shared/api/types/server.types';

import { IncidentDetailsContext } from './use-incident-details-context';

export const IncidentDetailsProvider = ({ children }: { children: ReactNode }) => {
  const { id: paramId } = useParams();
  const incidentId = paramId ?? '';

  const incidentDetailsQueryKey = ['incident', incidentId] as const;

  const { data, isLoading, isError, error } = useQuery<IIncidentDetailsResponse>({
    queryKey: incidentDetailsQueryKey,
    queryFn: ({ signal }) => api.getIncidentDetails(incidentId, { signal }),
    enabled: Boolean(incidentId),
  });

  return (
    <IncidentDetailsContext.Provider
      value={{ incidentId, paramId, data, isLoading, isError, error }}
    >
      {children}
    </IncidentDetailsContext.Provider>
  );
};
