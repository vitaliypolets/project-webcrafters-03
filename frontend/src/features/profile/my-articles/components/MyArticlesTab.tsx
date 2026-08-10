'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { ArticlesList } from '@/features/articles/shared';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types/user';
import { getMyArticles } from '../my-articles.service';
import { EmptyArticlesState } from './EmptyArticlesState';
import styles from './ArticlesTab.module.css';

const getUserId = (user: User | null) =>
  user?.id ?? (user as (User & { _id?: string }) | null)?._id;

export function MyArticlesTab() {
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const userId = getUserId(user);
  const author =
    user && userId
      ? {
          id: userId,
          name: user.name,
          avatarUrl: user.avatarUrl,
          articlesCount:
            user.articlesCount ?? (user as User & { articlesAmount?: number }).articlesAmount,
        }
      : null;
  const active = (searchParams.get('tab') ?? 'my-articles') === 'my-articles';

  const query = useInfiniteQuery({
    queryKey: ['profile', 'my-articles', userId],
    enabled: active && Boolean(userId && author),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getMyArticles(userId!, author!, pageParam),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
  });

  if (!active) return null;

  const articles = query.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <section className={styles.section} aria-label="My Articles">
      {!isInitialized || (Boolean(userId) && query.isPending) ? (
        <p className={styles.status}>Loading articles…</p>
      ) : null}

      {isInitialized && !userId ? (
        <p className={styles.error} role="alert">
          Log in to view your articles.
        </p>
      ) : null}

      {query.isError ? (
        <div className={styles.error} role="alert">
          <p>Could not load your articles.</p>
          <button type="button" onClick={() => query.refetch()}>
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

      {articles.length > 0 ? <ArticlesList articles={articles} /> : null}

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
