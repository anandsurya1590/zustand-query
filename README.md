# zustand-query

A lightweight React state management library inspired by React Query, built on top of [Zustand](https://github.com/pmndrs/zustand). It provides hooks for data fetching, caching, and mutations with a simple API.

## Features

- Simple and minimal API
- Query and mutation hooks (`useQuery`, `useMutation`)
- Query client for cache management
- TypeScript support

## Installation

```bash
npm install zustand-query
```

or

```bash
yarn add zustand-query
```

## Usage

### 1. Setup QueryClient

```typescript
import { QueryClient } from "zustand-query";

const queryClient = new QueryClient();
```

### 2. useQuery Example

```typescript
import { useQuery } from "zustand-query";

const { data, isLoading, error } = useQuery("todos", fetchTodos);
```

### 3. useMutation Example

```typescript
import { useMutation } from "zustand-query";

const mutation = useMutation(addTodo);
```

## API Reference

- `useQuery(key, fetcher, options?)`
- `useMutation(mutationFn, options?)`
- `QueryClient`

## License

MIT
