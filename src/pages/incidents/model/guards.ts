import type {
  TIncidentPriority,
  TIncidentStatus,
  TPrioritySort,
} from '@/shared/hooks/use-query-params';

export const isPriorityType = (value: string): value is TIncidentPriority => {
  return value === 'low' || value === 'medium' || value === 'high' || value === 'allPriorities';
};

export const isStatusType = (value: string): value is TIncidentStatus => {
  return (
    value === 'in_progress' || value === 'resolved' || value === 'new' || value === 'allStatus'
  );
};

export const isSortType = (value: string): value is TPrioritySort => {
  return value === 'newest' || value === 'oldest';
};
