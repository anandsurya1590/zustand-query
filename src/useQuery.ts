import { useQueryStore } from "./queryClient";
import type { QueryOptions } from "./types";
import { useCallback, useEffect, useRef } from "react";

export function useQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 5000,
  retry,
}: QueryOptions<T>) {
  const {
    queries,
    setQueryData,
    setQueryError,
    setQueryLoading,
    setQuerySuccess,
  } = useQueryStore();
  const key = queryKey[0];
  const state = queries[key] || { isLoading: false };
  const retryCount = useRef(0);

  const fetchData = useCallback(async () => {
    setQueryLoading(key, true);
    try {
      const data = await queryFn();
      setQueryData(key, data);
      setQuerySuccess(key, true);
    } catch (error) {
      const isRetryNumber = typeof retry === "number";
      if (retry && retryCount.current < (isRetryNumber ? retry : 3)) {
        retryCount.current += 1;
        // Exponential backoff: 1s, 2s, 4s, etc.
        const delay = Math.min(
          1000 * Math.pow(2, retryCount.current - 1),
          30000
        );
        setTimeout(() => fetchData(), delay);
      }
      setQueryError(key, error);
    } finally {
      setQueryLoading(key, false);
    }
  }, [queryKey]);

  useEffect(() => {
    console.log(queryKey, "key");

    if (!enabled) return;
    const now = Date.now();
    const isStale = !state.updateAt || now - state.updateAt > staleTime;
    if (isStale && !state.isLoading) {
      fetchData();
    }
  }, [state.isLoading, state.isSuccess, queryKey]);

  return {
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isSuccess: state.isSuccess,
    refetch: fetchData,
  };
}
