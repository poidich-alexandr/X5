import type { IIncidentDetailsResponse } from '@/shared/api/types/server.types';
import { createAppContext, useAppContext } from '@/shared/lib/react/react';

interface IIncidentDetailsContext {
  data: IIncidentDetailsResponse | undefined;
  incidentId: string;
  paramId: string | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const IncidentDetailsContext = createAppContext<IIncidentDetailsContext>();

export const useIncidentDetailsContext = () => {
  const context = useAppContext(IncidentDetailsContext);
  return context;
};
