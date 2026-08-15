import { useEffect, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { fetchArticles } from '../articles-catalog.service';
import type { ArticleFilter } from '../articles-catalog.types';

const PER_PAGE = 12;

export const useArticlesQuery = (activeFilter: ArticleFilter = 'all') => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['articles', activeFilter],
    queryFn: ({ pageParam = 1 }) =>
      fetchArticles({ page: pageParam, perPage: PER_PAGE, filter: activeFilter }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
  });

  useEffect(() => {
    if (query.hasNextPage && query.data) {
      const nextPage = query.data.pages.length + 1;
      queryClient.prefetchQuery({
        queryKey: ['articles', activeFilter, 'page', nextPage],
        queryFn: () =>
          fetchArticles({ page: nextPage, perPage: PER_PAGE, filter: activeFilter }),
      });
    }
  }, [query.hasNextPage, query.data, activeFilter, queryClient]);

  const articles = useMemo(() => {
    const rawArticles = query.data?.pages.flatMap((page) => page.articles) ?? [];
    return Array.from(new Map(rawArticles.map((item) => [item.id, item])).values());
  }, [query.data]);

  const totalItems = query.data?.pages[0]?.totalItems ?? 0;

  return {
    ...query,
    articles,
    totalItems,
  };
};
