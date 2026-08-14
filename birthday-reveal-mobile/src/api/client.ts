import axios from 'axios';
import { config } from '../config/env';
import { tokenService } from '../services/token.service';
import { handleApiError } from './error';

// Allow global state managers to attach a logout callback
type LogoutHandler = () => void;
let onLogout: LogoutHandler | null = null;

export const setGlobalLogoutHandler = (handler: LogoutHandler) => {
  onLogout = handler;
};

export const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach access token securely
apiClient.interceptors.request.use(async (reqConfig) => {
  const token = await tokenService.getAccessToken();
  if (token && reqConfig.headers) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
}, Promise.reject);

// Response interceptor: error normalization and token refresh handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if it's a 401 and not a retry yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Make the refresh request directly to avoid interceptor loop
        const refreshResponse = await axios.post(`${config.API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        await tokenService.setTokens(accessToken, newRefreshToken);
        
        // Retry the original request with the new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and force global logout
        await tokenService.clearTokens();
        if (onLogout) {
          onLogout();
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Format error using the global strategy for non-401s or failed retries
    return handleApiError(error);
  }
);
