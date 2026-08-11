'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import Button from '@/components/ui/Button/Button';
import { Loader } from '@/components/ui/Loader/Loader';
import { ArticlesList } from '@/features/articles/shared';
import type { Article } from '@/types/article';
import { getAuthorArticles } from '../../author-articles.service';
import type { AuthorArticlesProps } from '../../author-articles.types';
import styles from './AuthorArticles.module.css';

const ARTICLES_PER_PAGE = 8;

export function AuthorArticles({ userId, author }: AuthorArticlesProps) {
  const query = useInfiniteQuery({
    queryKey: ['authors', 'articles', userId],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getAuthorArticles(userId, pageParam, ARTICLES_PER_PAGE),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
  });

  const articlesById = new Map<string, Article>();

  for (const page of query.data?.pages ?? []) {
    for (const article of page.data) {
      articlesById.set(article.id, {
        ...article,
        author: article.author ?? author,
      });
    }
  }

  const articles = Array.from(articlesById.values());

  const handleLoadMore = async () => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;

    const result = await query.fetchNextPage();

    if (!result.isError) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  if (query.isPending) {
    return (
      <section className={styles.section} aria-label="Author articles">
        <Loader />
      </section>
    );
  }

  if (query.isError && !query.data) {
    return (
      <section className={styles.section} aria-label="Author articles">
        <div className={`${styles.state} ${styles.error}`} role="alert">
          <p>Could not load author articles.</p>
          <Button
            className={styles.retryButton}
            size="sm"
            type="button"
            onClick={() => query.refetch()}
          >
            Try again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Author articles">
      {articles.length === 0 ? (
        <div className={styles.state} role="status">
          <p>Nothing found.</p>
        </div>
      ) : (
        <ArticlesList articles={articles} />
      )}

      {query.isFetchNextPageError ? (
        <p className={styles.nextPageError} role="alert">
          Could not load more articles.
        </p>
      ) : null}

      {query.hasNextPage ? (
        <div className={styles.loadMoreWrapper}>
          <Button
            className={styles.loadMoreButton}
            size="xl"
            type="button"
            disabled={query.isFetchingNextPage}
            onClick={handleLoadMore}
          >
            {query.isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
