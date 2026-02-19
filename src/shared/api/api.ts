import { apiInstance as api } from './api-instance';
import type { TIncidentDetailsResponse, TIncidentsListResponse, TIncidentsRequest } from './types/types';

export const getIncidents = async (
  params: TIncidentsRequest,
  options?: {
    signal?: AbortSignal;
  }
): Promise<TIncidentsListResponse> => {
  const { data } = await api.get<TIncidentsListResponse>('incidents', {
    params,
    signal: options?.signal,
  });
  return data;
};

export const getIncidentDetails = async (
  incidentId: string,
  options?: {
    signal?: AbortSignal;
  }
): Promise<TIncidentDetailsResponse> => {
  const { data } = await api.get<TIncidentDetailsResponse>(`/incidents/${incidentId}`, {
    signal: options?.signal,
  });
  return data;
};
