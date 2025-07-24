import type { MutationOptions } from "./types";
import { useState } from "react";

export function useMutation<TData, TVariables>({
  mutationFn,
  onSuccess,
  onError,
  onSettled,
}: MutationOptions<TData, TVariables>) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = async (variables: TVariables) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(variables);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (error) {
      setError(error);
      onError?.(error);
      throw error; // Re-throw the error for further handling if needed
    } finally {
      setLoading(false);
      onSettled?.();
    }
  };

  return {
    mutate,
    isLoading,
    error,
    data,
  };
}
