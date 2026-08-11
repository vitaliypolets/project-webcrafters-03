import Image from 'next/image';
import styles from '../../ArticleDetailsClient.module.css';
import { ArticleEntity } from '@/types/article';

type Props = {
  article: ArticleEntity;
  children?: React.ReactNode;
};

const ArticleDetails = ({ article, children }: Props) => {
  return (
    <article className={styles.articleContent}>
      <h1 className={styles.titleMainTitle}>{article.title}</h1>

      {article.imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className={styles.image}
            priority
          />
        </div>
      )}

      <div className={styles.articleContentText}>{article.article}</div>

      <div className={styles.subContent}>{children}</div>
    </article>
  );
};

export default ArticleDetails;
