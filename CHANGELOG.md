# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Added `useInfiniteQuery` hook for paginated data fetching
  - Supports automatic next page detection with `getNextPageParam`
  - Provides `fetchNextPage`, `hasNextPage`, and `isFetchingNextPage` utilities
  - Handles pagination state management automatically
- Added retry functionality for failed queries and mutations
  - Configurable retry count with exponential backoff
  - Default retry attempts: 3 times
  - Customizable via `retry` option (boolean or number)

### Changed

- Modified `queryKey` type in `QueryOptions` to accept array instead of string
  - Provides better type safety and flexibility for complex query keys
  - Maintains backward compatibility with string keys via array index 0

### Fixed

- Fixed missing dependencies in `useQuery` hook's `useEffect` dependency array
  - Added `enabled`, `staleTime`, `state.updateAt`, `fetchData`, and `queryKey` to prevent potential stale closures
  - This change helps ensure the effect updates correctly when these values change
  - Note: The double invocation of `useEffect` in development is expected behavior due to React's Strict Mode and helps catch potential issues

### Notes

- The double-rendering behavior in development is intentional when using React's Strict Mode
- This helps identify components with improper side effect cleanup or potential race conditions
- This behavior only occurs in development and not in production builds
