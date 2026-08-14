import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { celebrationService, Celebration, CelebrationDraftPayload } from '../services/celebration.service';

export const celebrationKeys = {
  all: ['celebrations'] as const,
  lists: () => [...celebrationKeys.all, 'list'] as const,
  list: (filters: string) => [...celebrationKeys.lists(), { filters }] as const,
  details: () => [...celebrationKeys.all, 'detail'] as const,
  detail: (id: string) => [...celebrationKeys.details(), id] as const,
};

export function useCelebrations() {
  return useQuery({
    queryKey: celebrationKeys.lists(),
    queryFn: () => celebrationService.listCelebrations(),
  });
}

export function useCelebration(id: string) {
  return useQuery({
    queryKey: celebrationKeys.detail(id),
    queryFn: () => celebrationService.getCelebration(id),
    enabled: !!id,
  });
}

export function useCreateCelebration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CelebrationDraftPayload) => celebrationService.createDraft(data),
    onSuccess: () => {
      // Invalidate list so that it refetches with the new draft
      queryClient.invalidateQueries({ queryKey: celebrationKeys.lists() });
    },
  });
}

export function useUpdateCelebration(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CelebrationDraftPayload>) => celebrationService.updateCelebration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: celebrationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: celebrationKeys.lists() });
    },
  });
}

export function useSealCelebration(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (defaultSendLocalTime: string) => celebrationService.sealCelebration(id, defaultSendLocalTime),
    onSuccess: () => {
      // Invalidate specific detail and lists
      queryClient.invalidateQueries({ queryKey: celebrationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: celebrationKeys.lists() });
    },
  });
}
