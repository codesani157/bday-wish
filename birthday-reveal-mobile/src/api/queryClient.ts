import { QueryClient } from '@tanstack/react-query';
import { ApiRequestError } from './error';

/**
 * Centralized loading state logic and data fetching boundary.
 * Use react-query to avoid scattered isLoading / error states in components.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Do not retry on Auth failures or Not Found
        if (error instanceof ApiRequestError) {
          if (error.statusCode === 401 || error.statusCode === 403) return false;
          if (error.statusCode === 404) return false;
        }
        return failureCount < 2; // Default retry twice for transient failures
      },
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      refetchOnWindowFocus: true, // Background refetch on focus
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});
