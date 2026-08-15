"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Container } from "@/components/ui/Container/Container";
import { Loader } from "@/components/ui/Loader/Loader";
import { getAvatarSrc } from "@/utils/getAvatarSrc";

import { getTopCreators } from "../../home.service";
import styles from "./TopCreators.module.css";

export const TopCreators = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["topCreators"],
    queryFn: getTopCreators,
  });

  if (isLoading) {
    return (
      <div className={styles.centerContainer}>
        <Loader />
      </div>
    );
  }

  if (isError || !data?.data) {
    return null;
  }

  return (
    <section className={styles.section} id="top-creators">
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>Top Creators</h2>
          <Link href="/authors" className={styles.link}>
            Go to all Creators <span className={styles.arrow}>↗</span>
          </Link>
        </div>

        <ul className={styles.list}>
          {data.data.map((creator) => (
            <li key={creator.id} className={styles.item}>
              <div className={styles.avatarWrapper}>
                <Image
                  src={getAvatarSrc(creator.avatarUrl)}
                  alt={creator.name}
                  width={64}
                  height={64}
                  className={styles.avatar}
                />
              </div>
              <h3 className={styles.name}>{creator.name}</h3>
              <p className={styles.articlesCount}>{creator.articlesAmount} articles</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
