import { apiInstance as axios } from './api-instance';
import type {
  TIncidentDetailsResponse,
  TIncidentsListResponse,
  TIncidentsRequest,
  TIncidentStatusDTO,
} from './types/server.types';

export const getIncidents = async (
  params: TIncidentsRequest,
  options?: {
    signal?: AbortSignal;
  }
): Promise<TIncidentsListResponse> => {
  const { data } = await axios.get<TIncidentsListResponse>('incidents', {
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
  const { data } = await axios.get<TIncidentDetailsResponse>(`/incidents/${incidentId}`, {
    signal: options?.signal,
  });
  return data;
};

// TODO добавить в хендлерах сервера запрос на update
export const updateIncidentStatus = async (
  incidentId: string,
  nextStatus: TIncidentStatusDTO,
  options?: {
    signal?: AbortSignal;
  }
): Promise<TIncidentStatusDTO> => {
  const { data } = await axios.put<TIncidentStatusDTO>('');
  return data;
};
