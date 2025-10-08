import { useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export function useInfiniteScroll({ hasMore, loading, onLoadMore }: UseInfiniteScrollOptions) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, loading, onLoadMore]
  );

  return lastElementRef;
}
