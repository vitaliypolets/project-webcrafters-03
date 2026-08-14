'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useState, type MouseEvent } from 'react';

import { ArticlesList } from '@/features/articles/shared';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types/user';

import { getMyArticles } from '../my-articles.service';
import {
  addSavedArticle,
  removeSavedArticle,
} from '../../saved-articles/saved-articles.service';
import { EmptyArticlesState } from './EmptyArticlesState';

import styles from './ArticlesTab.module.css';

const getUserId = (user: User | null) =>
  user?.id ?? (user as (User & { _id?: string }) | null)?._id;

export function MyArticlesTab() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [bookmarkOverrides, setBookmarkOverrides] = useState<
    Record<string, boolean>
  >({});
  const [bookmarkRenderKey, setBookmarkRenderKey] = useState(0);

  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const userId = getUserId(user);

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
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
  });

  const bookmarkMutation = useMutation({
    mutationFn: ({
      articleId,
      shouldSave,
    }: {
      articleId: string;
      shouldSave: boolean;
    }) =>
      shouldSave
        ? addSavedArticle(articleId)
        : removeSavedArticle(articleId),
    onSuccess: (_response, { articleId, shouldSave }) => {
      setBookmarkOverrides((current) => ({
        ...current,
        [articleId]: shouldSave,
      }));
      setBookmarkRenderKey((current) => current + 1);

      void queryClient.invalidateQueries({
        queryKey: ['profile', 'saved-articles', userId],
      });
    },
  });

  if (!active) return null;

  const articles =
    query.data?.pages.flatMap((page) => page.data) ?? [];
  const displayedArticles = articles.map((article) => ({
    ...article,
    isBookmarked:
      bookmarkOverrides[article.id] ?? article.isBookmarked,
  }));

  // Keep bookmark requests local to participant #9 until ArticlesList exposes
  // a bookmark callback. The shared BookmarkButton remains unchanged.
  const handleBookmarkClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>(
      'button[aria-label="Save bookmark"], button[aria-label="Remove bookmark"]',
    );
    const item = target.closest('li');

    if (!button || !item || bookmarkMutation.isPending) return;

    const items = Array.from(
      event.currentTarget.querySelectorAll('li'),
    );
    const article = displayedArticles[items.indexOf(item)];

    if (!article) return;

    event.preventDefault();
    event.stopPropagation();
    bookmarkMutation.mutate({
      articleId: article.id,
      shouldSave: !article.isBookmarked,
    });
  };

  return (
    <section
      className={styles.section}
      aria-label="My Articles"
    >
      {!isInitialized ||
      (Boolean(userId) && query.isPending) ? (
        <p className={styles.status}>
          Loading articles…
        </p>
      ) : null}

      {isInitialized && !userId ? (
        <p className={styles.error} role="alert">
          Log in to view your articles.
        </p>
      ) : null}

      {query.isError ? (
        <div className={styles.error} role="alert">
          <p>Could not load your articles.</p>

          <button
            type="button"
            onClick={() => query.refetch()}
          >
            Try again
          </button>
        </div>
      ) : null}

      {query.isSuccess && articles.length === 0 ? (
        <EmptyArticlesState
          description="Write your first article"
          actionLabel="Create an article"
          href="/articles/create"
        />
      ) : null}

      {bookmarkMutation.isError ? (
        <p className={styles.error} role="alert">
          Could not update the bookmark.
        </p>
      ) : null}

      {articles.length > 0 ? (
        <div
          className={styles.articles}
          onClickCapture={handleBookmarkClick}
        >
          <ArticlesList
            key={bookmarkRenderKey}
            articles={displayedArticles}
          />
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
