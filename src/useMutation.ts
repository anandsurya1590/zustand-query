import type { MutationOptions } from "./types";
import { useState, useRef } from "react";

export function useMutation<TData, TVariables>({
  retry,
  mutationFn,
  onSuccess,
  onError,
  onSettled,
}: MutationOptions<TData, TVariables>) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TData | null>(null);
  const retryCount = useRef(0);

  const mutate = async (variables: TVariables) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(variables);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (error) {
      retryFetch(variables);
      setError(error);
      onError?.(error);
      throw error; // Re-throw the error for further handling if needed
    } finally {
      setLoading(false);
      onSettled?.();
    }
  };

  const retryFetch = async (variables: TVariables) => {
    if (!retry) return;
    const isRetryNumber = typeof retry === "number";
    if (retry && retryCount.current < (isRetryNumber ? retry : 3)) {
      retryCount.current += 1;
      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = Math.min(1000 * Math.pow(2, retryCount.current - 1), 30000);
      setTimeout(async () => await mutate(variables), delay);
    }
  };

  return {
    mutate,
    isLoading,
    error,
    data,
  };
}
