import type { ArticlesCatalogProps } from '../../articles-catalog.types';
import { ArticlesList } from '@/features/articles/shared'; 

import css from './ArticlesCatalog.module.css';

export const ArticlesCatalog = ({
  articles,
  isLoading,
  isError,
  isLoadingMore,
  hasNextPage,
  onLoadMore,
}: ArticlesCatalogProps) => {
  if (isLoading) {
    return <div className={css.statusMessage}>Loading articles...</div>;
  }

  if (isError) {
    return (
      <div className={css.errorMessage}>
        Something went wrong. Failed to load articles.
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return <div className={css.statusMessage}>No articles found.</div>;
  }

  return (
    <div className={css.catalogContainer}>
      <ArticlesList articles={articles} />

      {hasNextPage && (
        <div className={css.loadMoreWrapper}>
          <button
            type="button"
            className={css.loadMoreBtn}
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};
