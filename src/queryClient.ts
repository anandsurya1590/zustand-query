import { create } from "zustand";
import type { QueryState } from "./types";

type QueryStore = {
  queries: Record<string, QueryState<any>>;
  setQueryData: (key: string, data: any) => void;
  setQueryError: (key: string, error: Error) => void;
  setQueryLoading: (key: string, isLoading: boolean) => void;
  setQuerySuccess: (key: string, isSuccess: boolean) => void;
  clearQuery: (key: string) => void;
  refetchQuery: (key: string) => Promise<void>;
};

const useQueryStore = create<QueryStore>((set, get) => ({
  queries: {},
  setQueryData: (key, data) =>
    set((state) => ({
      queries: {
        ...state.queries,
        [key]: {
          ...state.queries[key],
          data,
        },
      },
    })),
  setQueryError: (key, error) =>
    set((state) => ({
      queries: {
        ...state.queries,
        [key]: {
          ...state.queries[key],
          error,
        },
      },
    })),
  setQueryLoading: (key, isLoading) =>
    set((state) => {
      return {
        queries: {
          ...state.queries,
          [key]: {
            ...state.queries[key],
            isLoading,
            updateAt: Date.now(), // Update the timestamp when loading state changes
          },
        },
      };
    }),
  setQuerySuccess: (key, isSuccess) =>
    set((state) => ({
      queries: {
        ...state.queries,
        [key]: {
          ...state.queries[key],
          isSuccess,
        },
      },
    })),
  setQueryFn: (key: string, fn: () => Promise<any>) =>
    set((state) => ({
      queries: {
        ...state.queries,
        [key]: { ...state.queries[key], queryFn: fn },
      },
    })),
  clearQuery: (key) =>
    set((state) => {
      const { [key]: _, ...queries } = state.queries;
      return { queries };
    }),
  refetchQuery: async (key) => {
    const query = get().queries[key];
    if (query?.queryFn) {
      get().setQueryLoading(key, true);
      try {
        const data = await query.queryFn();
        get().setQueryData(key, data);
      } catch (err) {
        get().setQueryError(key, err as Error);
      }
    }
  },
}));

const invalidateQuery = (keys: string[]) => {
  const store = useQueryStore.getState();
  keys.forEach((key) => {
    store.clearQuery(key);
    store.refetchQuery(key);
  });
};

const getState = (queryKey: string) => {
  if (!useQueryStore.getState().queries[queryKey]) {
    console.warn(`Query with key "${queryKey}" does not exist.`);
    return null;
  }
  return useQueryStore.getState().queries[queryKey].data || null;
};

export { useQueryStore };
export const queryClient = {
  getState,
  invalidateQuery,
};
