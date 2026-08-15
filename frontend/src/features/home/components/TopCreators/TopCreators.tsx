'use client'

import Image from 'next/image';
import Link from "next/link";
import { useQuery } from '@tanstack/react-query';

import { Loader } from '@/components/ui/Loader/Loader';
import { getTopCreators } from '../../home.service';
import styles from './TopCreators.module.css';

export const TopCreators = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['topCreators'],
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
      <div className={styles.container}>
        <h2 className={styles.title}>Top Creators</h2>
        <Link href="/creators" className={styles.link}>
          Go to all Creators <span className={styles.arrow}>↗</span>
        </Link>
        <ul className={styles.list}>
          {data.data.map((creator) => (
            <li key={creator.id} className={styles.item}>
              <div className={styles.avatarWrapper}>
                {creator.avatarUrl ? (
                  <Image
                    src={creator.avatarUrl}
                    alt={creator.name}
                    width={64}
                    height={64}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {creator.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className={styles.name}>{creator.name}</h3>
              <p className={styles.articlesCount}>{creator.articlesAmount} articles</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
