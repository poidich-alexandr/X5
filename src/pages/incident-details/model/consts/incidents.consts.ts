import type { IDropDownOption } from '../../../../shared/ui/dropdown/dropdown';

export const priorityDetailOptions: IDropDownOption[] = [
  //нет all
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

export const statusDetailOptions: IDropDownOption[] = [
  //нет all
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

export const sortDetailOptions: IDropDownOption[] = [
  //такой же как в incidentspage
  {
    text: 'new first',
    value: 'newest',
  },
  {
    text: 'old first',
    value: 'oldest',
  },
];
