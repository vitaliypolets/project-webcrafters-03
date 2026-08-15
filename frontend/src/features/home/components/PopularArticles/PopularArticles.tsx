'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { Loader } from '@/components/ui/Loader/Loader';
import { ArticlesList } from '@/features/articles/shared/components/ArticlesList/ArticlesList';
import { getPopularArticles } from '../../home.service';
import styles from './PopularArticles.module.css';

export const PopularArticles = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['popularArticles'],
    queryFn: () => getPopularArticles(4),
  });

  if (isLoading) {
    return (
      <div className={styles.centerContainer}>
        <Loader />
      </div>
    );
  }

  if (isError || !data?.articles) {
    return null;
  }

  return (
    <section
      className={styles.section}
      id="popular-articles"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Popular Articles</h2>
          <Link
            href="/articles"
            className={styles.link}
          >
            Go to all Articles <span className={styles.arrow}>↗</span>
          </Link>
        </div>

        <ArticlesList articles={data.articles} />
      </div>
    </section>
  );
};
