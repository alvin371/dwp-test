import { QueryClient, type InvalidateQueryFilters, MutationCache } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess(_data, _variables, _context, mutation) {
      if (mutation.meta?.invalidateQueries) {
        queryClient.invalidateQueries(
          mutation.meta.invalidateQueries as InvalidateQueryFilters<readonly unknown[]>,
        );
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});
