'use client';

import { useEffect, useState } from 'react';

import { getAuthors } from '@/features/authors/authors.service';
import type { PublicUser } from '@/types/user';


import styles from './AuthorsPage.module.css';
import AuthorsList from '@/features/authors/components/AuthorsList/AuthorsList';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<PublicUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const data = await getAuthors();
        setAuthors(data.authors);
      } catch (error) {
        console.error(error);
        setError('Не вдалося завантажити авторів');
      }
    };

    loadAuthors();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Authors</h1>

        <AuthorsList authors={authors} />
      </div>
    </main>
  );
}
