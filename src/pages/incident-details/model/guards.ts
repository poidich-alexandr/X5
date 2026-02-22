import type { TIncidentPriorityDTO, TIncidentStatusDTO } from '@/shared/api/types/server.types';

export const isIncidentStatusDTO = (value: string): value is TIncidentStatusDTO => {
  return value === 'in_progress' || value === 'resolved' || value === 'new';
};
export const isIncidentPriorityDTO = (value: string): value is TIncidentPriorityDTO => {
  return value === 'low' || value === 'medium' || value === 'high';
};
