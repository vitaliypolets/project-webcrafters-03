import Image from "next/image";

import { Button } from "@/components/ui/Button";

import type { ArticlesItemProps } from "../../article-shared.types";
import { BookmarkButton } from "../BookmarkButton/BookmarkButton";

import styles from "./ArticlesItem.module.css";

export const ArticlesItem = ({
  article,
  action = "bookmark",
  className,
}: ArticlesItemProps) => {
  const imageUrl =
    article.imageUrl.match(/\((.*?)\)/)?.[1] ?? article.imageUrl;

  return (
    <article className={`${styles.article} ${className ?? ""}`}>
      <Image
        className={styles.image}
        src={imageUrl}
        alt={article.title}
        width={368}
        height={233}
        sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1439px) calc(50vw - 48px), 368px"
        quality={75}
      />

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

        {action === "edit" ? (
          <Button
            href={`/articles/${article.id}/edit`}
            variant="secondary"
            size="sm"
            className={styles.editButton}
            aria-label="Edit article"
          >
            <svg className={styles.editIcon} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-edit" />
            </svg>
          </Button>
        ) : (
          <BookmarkButton
            articleId={article.id}
            isBookmarked={article.isBookmarked ?? false}
            className={styles.bookmark}
          />
        )}
      </div>
    </article>
  );
};
