import { useQueryStore } from "./queryClient";
import type { QueryOptions, QueryState } from "./types";
import { useCallback, useEffect, useRef } from "react";

export type InfiniteQueryState<T> = Omit<QueryState<T>, "data"> & {
  data: {
    pages: T[];
    pageParams: any[];
  };
};

export type InfiniteQueryOptions<T> = Omit<QueryOptions<T>, "queryFn"> & {
  queryFn: (pageParam: any) => Promise<T>;
  getNextPageParam?: (lastPage: T, allPages: T[], lastPageParam: number) => any;
  initialPageParam?: any;
};

export function useInfiniteQuery<T>({
  queryKey,
  enabled = true,
  initialPageParam = 0,
  staleTime = 5000,
  retry,
  queryFn,
  getNextPageParam,
}: InfiniteQueryOptions<T>) {
  const {
    queries,
    setQueryData,
    setQueryError,
    setQueryLoading,
    setQuerySuccess,
  } = useQueryStore();
  const key = queryKey[0];
  const state = (queries[key] || {
    isLoading: false,
    data: { pages: [], pageParams: [] },
  }) as InfiniteQueryState<T>;

  const retryCount = useRef(0);
  const hasNextPage = useRef(true);
  const isFetchingNextPage = useRef(false);

  const fetchPage = async (pageParam: any) => {
    setQueryLoading(key, true);
    try {
      const data = await queryFn(pageParam);
      const currentState = queries[key] as InfiniteQueryState<T>;
      const newPages = [...(currentState?.data?.pages || []), data];
      const newPageParams = [
        ...(currentState?.data?.pageParams || []),
        pageParam,
      ];

      setQueryData(key, {
        pages: newPages,
        pageParams: newPageParams,
      });

      setQuerySuccess(key, true);

      // Determine if there's a next page
      if (getNextPageParam) {
        const nextPageParam = getNextPageParam(data, newPages, pageParam);
        hasNextPage.current =
          nextPageParam !== undefined && nextPageParam !== null;
      }

      return data;
    } catch (error) {
      const isRetryNumber = typeof retry === "number";
      if (retry && retryCount.current < (isRetryNumber ? retry : 3)) {
        retryCount.current += 1;
        const delay = Math.min(
          1000 * Math.pow(2, retryCount.current - 1),
          30000
        );
        setTimeout(() => fetchPage(pageParam), delay);
      }
      setQueryError(key, error);
      throw error;
    } finally {
      setQueryLoading(key, false);
      isFetchingNextPage.current = false;
    }
  };

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage.current || isFetchingNextPage.current) return;

    isFetchingNextPage.current = true;
    const currentState = queries[key] as InfiniteQueryState<T>;
    const lastPage =
      currentState?.data?.pages[currentState.data.pages.length - 1];
    const lastPageParam =
      currentState?.data?.pageParams[currentState.data.pageParams.length - 1];

    if (!lastPage && (currentState?.data?.pages || []).length === 0) {
      return fetchPage(initialPageParam);
    }

    const nextPageParam =
      getNextPageParam?.(
        lastPage,
        currentState?.data?.pages || [],
        lastPageParam
      ) ?? lastPageParam + 1;
    return fetchPage(nextPageParam);
  }, [queryKey, initialPageParam, getNextPageParam]);

  useEffect(() => {
    if (!enabled) return;

    const now = Date.now();
    const isStale = !state.updateAt || now - state.updateAt > staleTime;

    if (isStale && !state.isLoading && state.data.pages.length === 0) {
      fetchNextPage();
    }
  }, [enabled, staleTime, queryKey, fetchNextPage]);

  return {
    ...state,
    fetchNextPage,
    hasNextPage: hasNextPage.current,
    isFetchingNextPage: isFetchingNextPage.current,
  };
}
