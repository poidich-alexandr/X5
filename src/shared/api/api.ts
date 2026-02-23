import { isAxiosError } from 'axios';

import { apiInstance as axios } from './api-instance';
import type {
  IAddNoteResponse,
  IIncidentDetailsResponse,
  IIncidentsListResponse,
  IIncidentsRequest,
  IUpdateIncidentPriorityResponse,
  IUpdateIncidentStatusResponse,
  TIncidentPriorityDTO,
  TIncidentStatusDTO,
} from './types/server.types';

export const getIncidents = async (
  params: IIncidentsRequest,
  options?: {
    signal?: AbortSignal;
  }
): Promise<IIncidentsListResponse> => {
  const { data } = await axios.get<IIncidentsListResponse>('/incidents', {
    params,
    signal: options?.signal,
  });
  return data;
};

export const getIncidentDetails = async (
  incidentId: string,
  options?: { signal?: AbortSignal }
): Promise<IIncidentDetailsResponse> => {
  try {
    const { data } = await axios.get<IIncidentDetailsResponse>(`/incidents/${incidentId}`, {
      signal: options?.signal,
    });

    return data;
  } catch (caughtError: unknown) {
    if (isAxiosError(caughtError)) {
      if (caughtError.response?.status === 404) {
        throw new Error('NOT_FOUND');
      }
    }

    throw caughtError;
  }
};
export const updateIncidentStatus = async (
  incidentId: string,
  payload: { status: TIncidentStatusDTO },
  options?: { signal?: AbortSignal }
): Promise<IUpdateIncidentStatusResponse> => {
  const { data } = await axios.patch<IUpdateIncidentStatusResponse>(
    `/incidents/${incidentId}`,
    payload,
    {
      signal: options?.signal,
    }
  );

  return data;
};

export const updateIncidentPriority = async (
  incidentId: string,
  payload: { priority: TIncidentPriorityDTO },
  options?: { signal?: AbortSignal }
): Promise<IUpdateIncidentPriorityResponse> => {
  const { data } = await axios.patch<IUpdateIncidentPriorityResponse>(
    `/incidents/${incidentId}`,
    payload,
    {
      signal: options?.signal,
    }
  );

  return data;
};

export const addIncidentNote = async (
  incidentId: string,
  payload: { message: string },
  options?: { signal?: AbortSignal }
): Promise<IAddNoteResponse> => {
  const { data } = await axios.post<IAddNoteResponse>(`/incidents/${incidentId}/notes`, payload, {
    signal: options?.signal,
  });

  return data;
};
