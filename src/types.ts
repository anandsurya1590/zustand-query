export type QueryState<T> = {
  data: T;
  error: Error;
  isLoading: boolean;
  isSuccess: boolean;
  updateAt?: number;
  queryFn?: () => Promise<T>;
};

export type QueryOptions<T> = {
  queryKey: any[];
  enabled?: boolean;
  staleTime?: number;
  retry?: number | boolean;
  queryFn: () => Promise<T>;
};

export type MutationOptions<TData, TVariables> = {
  retry?: number | boolean;
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};
