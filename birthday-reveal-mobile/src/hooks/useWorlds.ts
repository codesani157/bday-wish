import { useQuery } from '@tanstack/react-query';
import { worldService } from '../services/world.service';

export const worldKeys = {
  all: ['worlds'] as const,
  lists: () => [...worldKeys.all, 'list'] as const,
  details: () => [...worldKeys.all, 'detail'] as const,
  detail: (key: string) => [...worldKeys.details(), key] as const,
};

export function useWorlds() {
  return useQuery({
    queryKey: worldKeys.lists(),
    queryFn: () => worldService.listWorlds(),
  });
}

export function useWorldConfig(key: string) {
  return useQuery({
    queryKey: worldKeys.detail(key),
    queryFn: () => worldService.getWorldConfig(key),
    enabled: !!key,
  });
}
