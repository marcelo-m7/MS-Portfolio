/**
 * React Query Provider Setup
 * 
 * Configures QueryClient with optimal settings for portfolio data caching.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests 1 time
      retry: 1,
      // Refetch on window focus in production
      refetchOnWindowFocus: import.meta.env.PROD,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Data is fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query Devtools in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export { queryClient };
