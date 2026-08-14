import { create } from 'zustand';
import { authService, AuthSession } from '../services/auth.service';

interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  requestMagicLink: (email: string) => Promise<void>;
  verifyToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,
  
  requestMagicLink: async (email) => {
    await authService.requestMagicLink(email);
  },

  verifyToken: async (token) => {
    const session = await authService.verifyMagicLink(token);
    set({ session });
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ session: null });
    }
  },

  checkSession: async () => {
    try {
      const session = await authService.getSession();
      set({ session, isLoading: false });
    } catch {
      set({ session: null, isLoading: false });
    }
  },
}));
