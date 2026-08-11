'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import type { MouseEvent } from 'react';
import { ArticlesList } from '@/features/articles/shared';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types/user';
import { EmptyArticlesState } from '../../my-articles/components/EmptyArticlesState';
import styles from '../../my-articles/components/ArticlesTab.module.css';
import { getSavedArticles, removeSavedArticle } from '../saved-articles.service';
import type { SavedArticlesPage } from '../saved-articles.types';

const getUserId = (user: User | null) =>
  user?.id ?? (user as (User & { _id?: string }) | null)?._id;

export function SavedArticlesTab() {
  const searchParams = useSearchParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const queryClient = useQueryClient();
  const userId = getUserId(user);
  const queryKey = ['profile', 'saved-articles', userId] as const;
  const active = searchParams.get('tab') === 'saved-articles';

  const query = useInfiniteQuery({
    queryKey,
    enabled: active && Boolean(accessToken && userId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getSavedArticles(accessToken!, pageParam),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
  });

  const removeMutation = useMutation({
    mutationFn: (articleId: string) => removeSavedArticle(articleId, accessToken!),
    onMutate: async (articleId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<InfiniteData<SavedArticlesPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<SavedArticlesPage>>(queryKey, (current) =>
        current
          ? {
              ...current,
              pages: current.pages.map((page) => ({
                ...page,
                data: page.data.filter((article) => article.id !== articleId),
                totalItems: Math.max(0, page.totalItems - 1),
              })),
            }
          : current,
      );

      return { previous };
    },
    onError: (_error, _articleId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  if (!active) return null;

  const articles = query.data?.pages.flatMap((page) => page.data) ?? [];

  // ArticlesList owns the shared card. Capture its bookmark control here until
  // the shared component exposes an onBookmarkToggle prop.
  const handleBookmarkClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const button = target.closest('button');
    const item = target.closest('li');

    if (!button || !item || removeMutation.isPending) return;

    const items = Array.from(event.currentTarget.querySelectorAll('li'));
    const article = articles[items.indexOf(item)];

    if (!article) return;

    event.preventDefault();
    event.stopPropagation();
    removeMutation.mutate(article.id);
  };

  return (
    <section className={styles.section} aria-label="Saved Articles">
      {!isInitialized || (Boolean(accessToken && userId) && query.isPending) ? (
        <p className={styles.status}>Loading saved articles…</p>
      ) : null}

      {isInitialized && (!accessToken || !userId) ? (
        <p className={styles.error} role="alert">
          Log in to view saved articles.
        </p>
      ) : null}

      {query.isError ? (
        <div className={styles.error} role="alert">
          <p>Could not load saved articles.</p>
          <button type="button" onClick={() => query.refetch()}>
            Try again
          </button>
        </div>
      ) : null}

      {removeMutation.isError ? (
        <p className={styles.error} role="alert">
          Could not remove the bookmark.
        </p>
      ) : null}

      {query.isSuccess && articles.length === 0 ? (
        <EmptyArticlesState
          description="Save your first article"
          actionLabel="Go to articles"
          href="/articles"
        />
      ) : null}

      {articles.length > 0 ? (
        <div className={styles.articles} onClickCapture={handleBookmarkClick}>
          <ArticlesList articles={articles} />
        </div>
      ) : null}

      {query.hasNextPage ? (
        <button
          className={styles.loadMore}
          type="button"
          disabled={query.isFetchingNextPage}
          onClick={() => query.fetchNextPage()}
        >
          {query.isFetchingNextPage ? 'Loading…' : 'Load More'}
        </button>
      ) : null}
    </section>
  );
}
