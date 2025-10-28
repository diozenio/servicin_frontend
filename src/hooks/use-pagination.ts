import { useState, useCallback } from "react";

interface UsePaginationOptions {
  initialLimit?: number;
  initialOffset?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialLimit = 10, initialOffset = 0 } = options;

  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(initialOffset);

  const loadMore = useCallback(() => {
    setOffset((prev) => prev + limit);
  }, [limit]);

  const reset = useCallback(() => {
    setOffset(0);
  }, []);

  const setPageSize = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setOffset(0);
  }, []);

  return {
    limit,
    offset,
    loadMore,
    reset,
    setPageSize,
  };
}
