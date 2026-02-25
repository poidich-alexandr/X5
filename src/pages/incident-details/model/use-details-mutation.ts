import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/shared/api';
import type {
  IIncidentDetailsResponse,
  TIncidentPriorityDTO,
  TIncidentStatusDTO,
} from '@/shared/api/types/server.types';

export const useDetailsMutation = ({
  incidentId,
  onAddNoteSuccess,
}: {
  incidentId: string;
  onAddNoteSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const incidentDetailsQueryKey = ['incident', incidentId] as const;

  const updateStatusMutation = useMutation({
    mutationFn: (nextStatus: TIncidentStatusDTO) =>
      api.updateIncidentStatus(incidentId, { status: nextStatus }),

    onMutate: async (nextStatus) => {
      await queryClient.cancelQueries({ queryKey: incidentDetailsQueryKey });

      const previousData =
        queryClient.getQueryData<IIncidentDetailsResponse>(incidentDetailsQueryKey);

      queryClient.setQueryData<IIncidentDetailsResponse>(incidentDetailsQueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          incident: {
            ...old.incident,
            status: nextStatus,
          },
        };
      });

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(incidentDetailsQueryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: incidentDetailsQueryKey });
    },
  });

  const updatePriorityMutation = useMutation({
    mutationFn: (nextPriority: TIncidentPriorityDTO) =>
      api.updateIncidentPriority(incidentId, { priority: nextPriority }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: incidentDetailsQueryKey });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: (message: string) => api.addIncidentNote(incidentId, { message }),
    onSuccess: () => {
      onAddNoteSuccess?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: incidentDetailsQueryKey });
    },
  });

  return { updateStatusMutation, updatePriorityMutation, addNoteMutation };
};
