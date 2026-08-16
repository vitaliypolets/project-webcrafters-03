'use client';

import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { ArticlesList } from '@/features/articles/shared';
import { useAuthStore } from '@/store/auth.store';

import { getMyArticles } from '../my-articles.service';
import { EmptyArticlesState } from './EmptyArticlesState';

import styles from './ArticlesTab.module.css';

export function MyArticlesTab() {
  const searchParams = useSearchParams();

  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const userId = user?.id;

  const author =
    user && userId
      ? {
          id: userId,
          name: user.name,
          avatarUrl: user.avatarUrl,
          articlesAmount: user.articlesAmount,
        }
      : null;

  const active =
    (searchParams.get('tab') ?? 'my-articles') === 'my-articles';

  const query = useInfiniteQuery({
    queryKey: ['profile', 'my-articles', userId],
    enabled: active && Boolean(userId && author),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getMyArticles(userId!, author!, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.hasNextPage
        ? lastPage.data.meta.page + 1
        : undefined,
  });

  const isPaused = query.fetchStatus === 'paused';
  const hasQueryError = query.isError || isPaused;
  const errorMessage = isPaused
    ? 'You appear to be offline. Check your connection and try again.'
    : 'Could not load your articles.';

  useEffect(() => {
    const toastId = 'my-articles-query-error';

    if (!active || !hasQueryError) {
      toast.dismiss(toastId);
      return;
    }

    toast.error(errorMessage, {
      id: toastId,
    });
  }, [active, errorMessage, hasQueryError]);

  if (!active) return null;

  const articles =
    query.data?.pages.flatMap((page) => page.data.items) ?? [];

  return (
    <section
      className={styles.section}
      aria-label="My Articles"
    >
      {!isInitialized ||
      (Boolean(userId) &&
        query.isPending &&
        query.fetchStatus === 'fetching') ? (
        <p className={styles.status}>
          Loading articles…
        </p>
      ) : null}

      {isInitialized && !userId ? (
        <p className={styles.error} role="alert">
          Log in to view your articles.
        </p>
      ) : null}

      {hasQueryError ? (
        <div className={styles.error} role="alert">
          <p>{errorMessage}</p>

          <button
            type="button"
            onClick={() => query.refetch()}
          >
            Try again
          </button>
        </div>
      ) : null}

      {query.isSuccess && !hasQueryError && articles.length === 0 ? (
        <EmptyArticlesState
          description="Write your first article"
          actionLabel="Create an article"
          href="/articles/create"
        />
      ) : null}

      {articles.length > 0 ? (
        <div className={styles.articles}>
          <ArticlesList articles={articles} action="edit" />
        </div>
      ) : null}

      {query.hasNextPage ? (
        <button
          className={styles.loadMore}
          type="button"
          disabled={query.isFetchingNextPage}
          onClick={() => query.fetchNextPage()}
        >
          {query.isFetchingNextPage
            ? 'Loading…'
            : 'Load More'}
        </button>
      ) : null}
    </section>
  );
}
