'use client';

import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArticlesList } from '@/features/articles/shared';
import { useAuthStore } from '@/store/auth.store';
import { EmptyArticlesState } from '../../my-articles/components/EmptyArticlesState';
import styles from '../../my-articles/components/ArticlesTab.module.css';
import { getSavedArticles } from '../saved-articles.service';

export function SavedArticlesTab() {
  const searchParams = useSearchParams();
  const listWrapperRef = useRef<HTMLDivElement>(null);
  const pendingScrollIndexRef = useRef<number | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const userId = user?.id;
  const queryKey = ['saved-articles', userId] as const;
  const active = searchParams.get('tab') === 'saved-articles';

  const query = useInfiniteQuery({
    queryKey,
    enabled: active && Boolean(accessToken && userId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getSavedArticles(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.hasNextPage
        ? lastPage.data.meta.page + 1
        : undefined,
  });

  const isPaused = query.fetchStatus === 'paused';
  const hasQueryError = query.isError || isPaused;
  const errorMessage = isPaused
    ? 'You appear to be offline. Check your connection and try again.'
    : 'Could not load saved articles.';

  useEffect(() => {
    const toastId = 'saved-articles-query-error';

    if (!active || !hasQueryError) {
      toast.dismiss(toastId);
      return;
    }

    toast.error(errorMessage, {
      id: toastId,
    });
  }, [active, errorMessage, hasQueryError]);

  const articles =
    query.data?.pages.flatMap((page) => page.data.items) ?? [];

  useEffect(() => {
    const firstNewArticleIndex = pendingScrollIndexRef.current;

    if (firstNewArticleIndex === null || query.isFetchingNextPage) return;

    if (query.isFetchNextPageError || articles.length <= firstNewArticleIndex) {
      pendingScrollIndexRef.current = null;
      return;
    }

    const items = listWrapperRef.current?.querySelectorAll('li');
    const firstNewItem = items?.item(firstNewArticleIndex);

    firstNewItem?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    pendingScrollIndexRef.current = null;
  }, [articles.length, query.isFetchNextPageError, query.isFetchingNextPage]);

  const handleLoadMore = async () => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;

    pendingScrollIndexRef.current = articles.length;
    const result = await query.fetchNextPage();

    if (result.isError) pendingScrollIndexRef.current = null;
  };

  if (!active) return null;

  return (
    <section className={styles.section} aria-label="Saved Articles">
      {!isInitialized ||
      (Boolean(accessToken && userId) &&
        query.isPending &&
        query.fetchStatus === 'fetching') ? (
        <p className={styles.status}>Loading saved articles…</p>
      ) : null}

      {isInitialized && (!accessToken || !userId) ? (
        <p className={styles.error} role="alert">
          Log in to view saved articles.
        </p>
      ) : null}

      {hasQueryError ? (
        <div className={styles.error} role="alert">
          <p>{errorMessage}</p>
          <button type="button" onClick={() => query.refetch()}>
            Try again
          </button>
        </div>
      ) : null}

      {query.isSuccess && !hasQueryError && articles.length === 0 ? (
        <EmptyArticlesState
          description="Save your first article"
          actionLabel="Go to articles"
          href="/articles"
        />
      ) : null}

      {articles.length > 0 ? (
        <div ref={listWrapperRef} className={styles.articles}>
          <ArticlesList articles={articles} />
        </div>
      ) : null}

      {query.hasNextPage ? (
        <button
          className={styles.loadMore}
          type="button"
          disabled={query.isFetchingNextPage}
          onClick={handleLoadMore}
        >
          {query.isFetchingNextPage ? 'Loading…' : 'Load More'}
        </button>
      ) : null}
    </section>
  );
}
