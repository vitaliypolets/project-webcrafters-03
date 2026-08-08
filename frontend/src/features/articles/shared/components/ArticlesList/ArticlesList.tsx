import type { ArticlesListProps } from '../../article-shared.types';

import { ArticlesItem } from '../ArticlesItem/ArticlesItem';

export const ArticlesList = ({ articles }: ArticlesListProps) => {
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>
          <ArticlesItem article={article} />
        </li>
      ))}
    </ul>
  );
};
