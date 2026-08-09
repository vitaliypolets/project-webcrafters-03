'use client';

import { useEffect, useState } from 'react';
import styles from './AuthorPage.module.css';
import { getAuthorById } from '@/features/authors/authors.service';
import type { PublicUser } from '@/types/user';

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

  return (
    <main className={styles.page}>
      <h1>{author.name}</h1>

      {author.avatarUrl && (
        <img src={author.avatarUrl} alt={author.name} width={200} />
      )}

      <p>Кількість статей: {author.articlesCount}</p>
    </main>
  );
}
