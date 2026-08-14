import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

/**
 * Normalizes an API error into a standard format.
 */
export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    
    if (data && data.code) {
      throw new ApiRequestError(
        error.response?.status || 500,
        data.code,
        data.message || 'An error occurred',
        data.details
      );
    }
    
    // Fallback for non-standard error responses
    throw new ApiRequestError(
      error.response?.status || 500,
      'UNKNOWN_ERROR',
      error.message || 'An unexpected error occurred',
    );
  }

  // Not an Axios error (e.g. network error)
  throw new ApiRequestError(
    500, 
    'INTERNAL_CLIENT_ERROR', 
    error instanceof Error ? error.message : String(error)
  );
}
