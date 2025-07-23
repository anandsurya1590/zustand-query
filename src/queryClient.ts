import { create } from "zustand";
import { QueryState } from "./types";

type QueryStore = {
  queries: Record<string, QueryState>;
  setQueryData: (key: string, data: unknown) => void;
  setQueryError: (key: string, error: Error) => void;
  setQueryLoading: (key: string, isLoading: boolean) => void;
  setQuerySuccess: (key: string, isSuccess: boolean) => void;
  clerQuery: (key: string) => void;
};

export const useQueryStore = create<QueryStore>((set) => ({
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
  clerQuery: (key) =>
    set((state) => {
      const { [key]: _, ...queries } = state.queries;
      return { queries };
    }),
}));

export const invalidateQuery = (key: string) => {
  useQueryStore.getState().clerQuery(key);
};
