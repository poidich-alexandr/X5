import type { IDropDownOption } from '@/shared/ui/dropdown/dropdown';

export const priorityOptions: IDropDownOption[] = [
  {
    text: 'All',
    value: 'allPriorities',
  },
  {
    text: 'Low',
    value: 'low',
  },
  {
    text: 'Medium',
    value: 'medium',
  },
  {
    text: 'High',
    value: 'high',
  },
];
export const statusOptions: IDropDownOption[] = [
  {
    text: 'All',
    value: 'allStatus',
  },
  {
    text: 'In progress',
    value: 'in_progress',
  },
  {
    text: 'Resolved',
    value: 'resolved',
  },
  {
    text: 'New',
    value: 'new',
  },
];

export const sortOptions: IDropDownOption[] = [
  {
    text: 'new first',
    value: 'newest',
  },
  {
    text: 'old first',
    value: 'oldest',
  },
];
