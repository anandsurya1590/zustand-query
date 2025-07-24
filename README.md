# react-zustand-query

A lightweight data fetching and caching library for React, inspired by React Query and built on top of [Zustand](https://github.com/pmndrs/zustand). It provides hooks for data fetching, caching, and mutations with a simple API and full TypeScript support.

## Features

- Simple and minimal API
- Query and mutation hooks: `useQuery`, `useMutation`
- Query client for cache management
- TypeScript support

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

## API Reference

- `useQuery({ queryKey, queryFn, options? })`
  - `queryKey`: Unique key for the query (string or array)
  - `queryFn`: Function that returns a promise (fetcher)
  - `options`: (optional) Additional options (e.g., enabled, refetchInterval)
- `useMutation(mutationFn, options?)`
  - `mutationFn`: Function that performs the mutation (returns a promise)
  - `options`: (optional) Additional options (e.g., onSuccess, onError)
- `QueryClient`
  - `.getState(queryKey)`: Get the state of a specific query
  - `.invalidateQueries(queryKey)`: Invalidate and refetch queries

## License

MIT
