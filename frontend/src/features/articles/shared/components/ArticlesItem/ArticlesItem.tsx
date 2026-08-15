import Image from "next/image";

import { Button } from "@/components/ui/Button";

import type { ArticlesItemProps } from "../../article-shared.types";
import { BookmarkButton } from "../BookmarkButton/BookmarkButton";

import styles from "./ArticlesItem.module.css";

export const ArticlesItem = ({ article }: ArticlesItemProps) => {
  const imageUrl = article.imageUrl.match(/\((.*?)\)/)?.[1] ?? article.imageUrl;

  return (
    <article className={styles.article}>
      <Image className={styles.image} src={imageUrl} alt={article.title} width={337} height={223} />

      <div className={styles.content}>
        <p className={styles.author}>{article.author.name}</p>

        <h2 className={styles.title}>{article.title}</h2>

        <p className={styles.description}>{article.description}</p>
      </div>

      <div className={styles.actions}>
        <Button
          href={`/articles/${article.id}`}
          variant="secondary"
          size="sm"
          className={styles.learnMore}
        >
          Learn more
        </Button>

        <BookmarkButton
          articleId={article.id}
          isBookmarked={article.isBookmarked ?? false}
          className={styles.bookmark}
        />
      </div>
    </article>
  );
};
