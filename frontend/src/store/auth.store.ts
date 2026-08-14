/*import { create } from 'zustand';
import type { User } from '@/types/user';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  isInitialized: boolean;

  setSession: (user: User, accessToken: string) => void;
  clearSession: () => void;
  setRefreshing: (value: boolean) => void;
  setInitialized: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isRefreshing: false,
  isInitialized: false,

  setSession: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
    }),

  clearSession: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setInitialized: (isInitialized) => set({ isInitialized }),
}));
*/

import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  isInitialized: boolean;

  setSession: (user: User, accessToken: string) => void;
  clearSession: () => void;
  setRefreshing: (isRefreshing: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // =========================
  // MOCK AUTH USER
  // =========================
  user: {
    id: 'local-user-1',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: '/images/default-avatar.png',
  },

  // Fake token — нужен только для локальной разработки
  accessToken: 'local-test-token',

  // Считаем пользователя авторизованным
  isAuthenticated: true,

  // Session уже проверена
  isRefreshing: false,
  isInitialized: true,

  // =========================
  // SET SESSION
  // =========================
  setSession: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isInitialized: true,
    }),

  // =========================
  // CLEAR SESSION / LOGOUT
  // =========================
  clearSession: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: true,
    }),

  // =========================
  // REFRESHING
  // =========================
  setRefreshing: (isRefreshing) =>
    set({
      isRefreshing,
    }),

  // =========================
  // INITIALIZED
  // =========================
  setInitialized: (isInitialized) =>
    set({
      isInitialized,
    }),
}));

