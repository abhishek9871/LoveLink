
import { create } from 'zustand';
import { mockApi } from '../services/api';
import { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  setToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('love_link_token'),
  loading: true,
  error: null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('love_link_token', token);
    } else {
      localStorage.removeItem('love_link_token');
    }
    set({ token });
  },
  checkAuth: async () => {
    const token = get().token;
    if (token) {
      set({ loading: true });
      try {
        const user = await mockApi.verifyToken(token);
        set({ isAuthenticated: true, user, loading: false, error: null });
      } catch (error) {
        get().setToken(null);
        set({ isAuthenticated: false, user: null, loading: false });
      }
    } else {
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },
  logout: () => {
    get().setToken(null);
    set({ isAuthenticated: false, user: null });
  },
  updateUser: (userData) => {
      set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
      }));
  }
}));

export default useAuthStore;
