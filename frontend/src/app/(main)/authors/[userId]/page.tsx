'use client';

import { useEffect, useState } from 'react';
import styles from './AuthorPage.module.css';
import { getAuthorById } from '@/features/authors/authors.service';
import type { PublicUser } from '@/types/user';
import Image from "next/image";

type AuthorPageProps = {
  params: Promise<{ userId: string }>;
};

export default function AuthorPage({ params }: AuthorPageProps) {
  const [author, setAuthor] = useState<PublicUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthor = async () => {
      try {
        const { userId } = await params;
        const data = await getAuthorById(userId);
        setAuthor(data);
      } catch (error) {
        setError('Не вдалося завантажити автора');
        console.error(error);
      }
    };

    loadAuthor();
  }, [params]);

  if (error) {
    return <main className={styles.page}>{error}</main>;
  }

  if (!author) {
    return <main className={styles.page}>Loading...</main>;
  }
const firstName = author.name.split(' ')[0];
  return (
    <main className={styles.page}>
      <div className="container">
      <div className={styles.wrapper}>
        <Image
          src={author.avatarUrl as string} 
          alt={author.name}
          width={124}
          height={124}
          className={styles.avatar}
      />
        <div className={styles.user_info}>
      <h1 className={styles.name}>{firstName}</h1>
          <p className={styles.articles}>{author.articlesCount} articles</p>
          </div>
        </div>
        <p>СПИСОК КАРТОК ВІД УЧАСНИКА 8</p>
      <p>КНОПКА LOAD MORE</p>
      </div>

    </main>
  );
}
    
