import Link from 'next/link';
import styles from '../../ArticleDetailsClient.module.css';
import { RecommendedArticle as RecommendedArticleType } from '../../article-details.types';

type Props = {
  recommendations: RecommendedArticleType[];
};

function parseRecommendation(recommend: RecommendedArticleType) {
  const { title, _id, author } = recommend;

  const articleLink = _id ? `/articles/${_id}` : '/login';
  const authorLink = author?._id ? `/users/${author._id}` : '/login';

  return {
    articleLink,
    articleTitle: title,
    authorName: author?.name || 'Невідомий автор',
    authorLink,
  };
}

const ArticleRecommendations = ({ recommendations }: Props) => {
  return (
    <ul className={styles.recommendList}>
      {recommendations.map((item) => {
        const parsed = parseRecommendation(item);

        return (
          <li key={item._id} className={styles.recommendItem}>
            <div className={styles.recommendArticleLinkItem}>
              <Link href={parsed.articleLink} className={styles.recommendArticleText}>
                {parsed.articleTitle}
              </Link>
            </div>
            <Link href={parsed.authorLink} className={styles.recommendAuthorLink}>
              {parsed.authorName}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default ArticleRecommendations;
