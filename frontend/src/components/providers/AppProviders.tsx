'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

import { restoreSession } from '@/features/auth/session/session.service';
import { useAuthStore } from '@/store/auth.store';

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setRefreshing = useAuthStore((state) => state.setRefreshing);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      setRefreshing(true);

      try {
        const session = await restoreSession();

        if (cancelled) return;

        setSession(session.user, session.accessToken);
      } catch {
        if (cancelled) return;

        clearSession();
      } finally {
        if (!cancelled) {
          setRefreshing(false);
          setInitialized(true);
        }
      }
    }

    restore();

    return () => {
      cancelled = true;
    };
  }, [setSession, clearSession, setRefreshing, setInitialized]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </QueryClientProvider>
  );
}
