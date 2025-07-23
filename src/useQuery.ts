import { useQueryStore } from "./queryClient";
import { QueryOptions } from "./types";
import { useCallback, useEffect } from "react";

export function useQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 5000,
}: QueryOptions<T>) {
  const {
    queries,
    setQueryData,
    setQueryError,
    setQueryLoading,
    setQuerySuccess,
  } = useQueryStore();
  const state = queries[queryKey] || { isLoading: false };

  const fetchData = useCallback(async () => {
    setQueryLoading(queryKey, true);
    try {
      const data = await queryFn();
      setQueryData(queryKey, data);
      setQuerySuccess(queryKey, true);
    } catch (error) {
      setQueryError(queryKey, error);
    } finally {
      setQueryLoading(queryKey, false);
    }
  }, [queryKey, queryFn]);

  useEffect(() => {
    if (!enabled) return;
    const now = Date.now();
    const isStale = !state.updateAt || now - state.updateAt > staleTime;
    if (isStale && !state.isLoading && !state.isSuccess) {
      fetchData();
    }
  }, [state.isLoading, state.isSuccess]);

  return {
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isSuccess: state.isSuccess,
    refetch: fetchData,
  };
}
