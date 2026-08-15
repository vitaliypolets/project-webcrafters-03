'use client';

import { ProfileInfo } from '@/features/profile';
import { useAuthStore } from '@/store/auth.store';

import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className={styles.header}>
      <h1
        className={styles.title}
        id="profile-title"
      >
        My Profile
      </h1>

      {user ? (
        <ProfileInfo
          name={user.name}
          avatarUrl={user.avatarUrl}
          articlesAmount={user.articlesAmount}
        />
      ) : null}
    </header>
  );
}
