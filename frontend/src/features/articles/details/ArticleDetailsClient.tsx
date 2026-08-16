"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { fetchArticleById } from "./article-details.service";
import styles from "./ArticleDetailsClient.module.css";
import { Container } from "@/components/ui/Container/Container";

import ArticleDetails from "./components/ArticleDetails/ArticleDetails";
import ArticleAuthor from "./components/ArticleAuthor/ArticleAuthor";
import ArticleRecommendations from "./components/ArticleRecommendations/ArticleRecommendations";
import { BookmarkButton } from "../shared";
import { Loader } from "@/components/ui/Loader/Loader";

type Props = {
  articleId: string;
};

const ArticleDetailsClient = ({ articleId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      try {
        return await fetchArticleById(articleId);
      } catch (err: unknown) {
        const error = err as { status?: number; response?: { status?: number } };

        if (error.status === 404 || error.response?.status === 404) {
          notFound();
        }
        throw err;
      }
    },
    enabled: articleId !== "",
    refetchOnMount: false,
    throwOnError: true,
  });

  if (isLoading || !data) {
    return <Loader />;
  }

  const { article, author, isBookmarked, recommendations } = data;
  const publicationDate = article.publicationDate;

  return (
    <Container>
      <div className={styles.article}>
        <ArticleDetails article={article}>
          <div className={styles.subContent}>
            <div className={styles.recomendation}>
              <ArticleAuthor author={author} publicationDate={publicationDate} />

              <p className={styles.intrastedText}>You can also interested</p>

              <ArticleRecommendations recommendations={recommendations} />
            </div>

            <div className={styles.articleBookmarkWrapper}>
              <BookmarkButton
                articleId={article.id}
                isBookmarked={isBookmarked}
                className={styles.articleBookmarkButton}
                label={"Save"}
              />
            </div>
          </div>
        </ArticleDetails>
      </div>
    </Container>
  );
};

export default ArticleDetailsClient;
