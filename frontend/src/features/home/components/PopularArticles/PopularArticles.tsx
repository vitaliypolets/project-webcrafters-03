"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Container } from "@/components/ui/Container/Container";
import { Loader } from "@/components/ui/Loader/Loader";
import { ArticlesItem } from "@/features/articles/shared/components/ArticlesItem/ArticlesItem";

import { getPopularArticles } from "../../home.service";
import styles from "./PopularArticles.module.css";

export const PopularArticles = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["popularArticles"],
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
    <section className={styles.section} id="popular-articles">
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>Popular Articles</h2>
          <Link href="/articles" className={styles.link}>
            Go to all Articles <span className={styles.arrow}>↗</span>
          </Link>
        </div>

        <ul className={styles.list}>
          {data.articles.map((article) => (
            <li className={styles.listItem} key={article.id}>
              <ArticlesItem article={article} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
