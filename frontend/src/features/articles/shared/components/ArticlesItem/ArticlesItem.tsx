import Image from 'next/image';
import Link from 'next/link';

import type { ArticlesItemProps } from '../../article-shared.types';
import { BookmarkButton } from '../BookmarkButton/BookmarkButton';
import styles from './ArticlesItem.module.css';

export const ArticlesItem = ({ article }: ArticlesItemProps) => {
  return (
    <article className={styles.article}>
      <Image
        className={styles.image}
        src={article.imageUrl}
        alt={article.title}
        width={337}
        height={223}
      />

      <p className={styles.author}>{article.author.name}</p>

      <h2 className={styles.title}>{article.title}</h2>

      <p className={styles.description}>{article.description}</p>

      <div className={styles.actions}>
        <Link className={styles.learnMore} href={`/articles/${article.id}`}>
          Learn more
        </Link>

        <BookmarkButton articleId={article.id} isBookmarked={article.isBookmarked ?? false} />
      </div>
    </article>
  );
};
