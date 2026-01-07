# react-zustand-query

A lightweight data fetching and caching library for React, inspired by React Query and built on top of [Zustand](https://github.com/pmndrs/zustand). It provides hooks for data fetching, caching, and mutations with a simple API and full TypeScript support.

For a detailed list of changes and updates, see the [CHANGELOG](./CHANGELOG.md).

### <a href="https://zustand-query.vercel.app">Read the docs →</b></a>

## Features

- Simple and minimal API
- Query and mutation hooks: `useQuery`, `useMutation`, `useInfiniteQuery`
- Automatic retries with exponential backoff
- Infinite query support for pagination
- Query client for cache management
- Full TypeScript support

## Installation

```bash
npm install react-zustand-query
```

or

```bash
yarn add react-zustand-query
```

## Usage

### 1. Setup QueryClient (optional)

```typescript
import { QueryClient } from "react-zustand-query";

// Create a query client instance (optional, only if you want to manage cache directly)
const queryClient = new QueryClient();

// Access query state by key
const userQueryState = queryClient.getState("user");
```

### 2. useQuery Example

```typescript
import { useQuery } from "react-zustand-query";

function fetchUser() {
  return fetch("https://jsonplaceholder.typicode.com/users/1").then((res) =>
    res.json()
  );
}

const { data, isLoading, error } = useQuery({
  queryKey: "user",
  queryFn: fetchUser,
});
```

### 3. useMutation Example

```typescript
import { useMutation } from "react-zustand-query";

function addTodo(newTodo) {
  return fetch("/api/todos", {
    method: "POST",
    body: JSON.stringify(newTodo),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}

const { mutate, data, error, isLoading } = useMutation({
  mutationFn: addTodo,
  onSuccess: () => {
    // handle success
  },
  onError: () => {
    // handle error
  },
});

// Usage in a component:
// mutate({ title: "New Todo" });
```

### 4. useInfiniteQuery Example

```typescript
import { useInfiniteQuery } from "react-zustand-query";

function fetchPosts({ pageParam = 0 }) {
  return fetch(`/api/posts?page=${pageParam}&limit=10`).then((res) =>
    res.json()
  );
}

const {
  data,
  isLoading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
  getNextPageParam: (lastPage, allPages, lastPageParam) => {
    // Return null/undefined to indicate no more pages
    return lastPage.hasMore ? lastPageParam + 1 : null;
  },
  initialPageParam: 0,
});

// Access the data
const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

// In your component:
return (
  <div>
    {allPosts.map((post) => (
      <div key={post.id}>{post.title}</div>
    ))}

    {hasNextPage && (
      <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        {isFetchingNextPage ? "Loading more..." : "Load More"}
      </button>
    )}
  </div>
);
```

## API Reference

### useQuery

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["users", userId],
  queryFn: fetchUser,
  enabled: boolean,
  staleTime: number,
  retry: boolean | number,
});
```

- `queryKey`: Unique key for the query (string or array)
- `queryFn`: Function that returns a promise (fetcher)
- `enabled`: (optional) Enable/disable the query
- `staleTime`: (optional) Time in ms before data is considered stale
- `retry`: (optional) Number of retry attempts or boolean

### useMutation

```typescript
const { mutate, isLoading, error, data } = useMutation({
  mutationFn: addTodo,
  onSuccess?: (data) => void,
  onError?: (error) => void,
  retry?: boolean | number
});
```

- `mutationFn`: Function that performs the mutation (returns a promise)
- `onSuccess`: (optional) Callback on successful mutation
- `onError`: (optional) Callback on mutation error
- `retry`: (optional) Number of retry attempts or boolean

### useInfiniteQuery

```typescript
const {
  data,
  isLoading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ["posts"],
  queryFn: fetchPostPage,
  getNextPageParam: (lastPage, allPages, lastPageParam) => lastPage.nextCursor,
  initialPageParam: 0,
});
```

- `queryKey`: Unique key for the query
- `queryFn`: Function that fetches a page of data
- `getNextPageParam`: (optional) Function to determine the next page parameter
- `initialPageParam`: (optional) Initial page parameter value
- Returns paginated data and utilities for infinite scrolling

### QueryClient

- `.getState(queryKey)`: Get the state of a specific query
- `.invalidateQueries(queryKey)`: Invalidate and refetch queries

## License

MIT

## Important note

- This is lib is only working with react+vite project, will soon fix the webpack issue. Happy web development.
- If facing any issue while using, feel free to raise issue: https://github.com/anandsurya1590/zustand-query/issues
