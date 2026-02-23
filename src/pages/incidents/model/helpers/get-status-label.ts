import type { TIncidentStatusDTO } from '../../../../shared/api/types/server.types';

const statusDictionary: { [key in TIncidentStatusDTO]: string } = {
  in_progress: 'in progress',
  new: 'new',
  resolved: 'resolved',
};

export const getStatusLabel = (statusDTO: TIncidentStatusDTO) => {
  return statusDictionary[statusDTO];
};
