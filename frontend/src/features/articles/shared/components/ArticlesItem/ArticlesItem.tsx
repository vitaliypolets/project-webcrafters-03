import Link from 'next/link';
import type { ArticlesItemProps } from '../../article-shared.types';

export const ArticlesItem = ({ article }: ArticlesItemProps) => {
  return (
    <article>
      <img src={article.imageUrl} alt={article.title} />

      <p>{article.author.name}</p>

      <h2>{article.title}</h2>

      <p>{article.description}</p>

      <Link href={`/articles/${article.id}`}>Learn more</Link>
    </article>
  );
};
