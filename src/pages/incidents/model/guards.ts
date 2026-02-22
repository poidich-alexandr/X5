// import type {
//   TIncidentPriorityParam,
//   TIncidentSortParam,
//   TIncidentStatusParam,
// } from '@/shared/api/types/client.types';

import type {
  TIncidentPriorityParam,
  TIncidentSortParam,
  TIncidentStatusParam,
} from '@/shared/hooks/use-query-params';

export const isPriorityType = (
  value: string
): value is TIncidentPriorityParam | 'allPriorities' => {
  return value === 'low' || value === 'medium' || value === 'high' || value === 'allPriorities';
};

export const isStatusType = (value: string): value is TIncidentStatusParam | 'allStatus' => {
  return (
    value === 'in_progress' || value === 'resolved' || value === 'new' || value === 'allStatus'
  );
};

export const isSortType = (value: string): value is TIncidentSortParam => {
  return value === 'newest' || value === 'oldest';
};
