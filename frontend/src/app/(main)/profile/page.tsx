'use client';

import { useQuery } from '@tanstack/react-query';

import { getProfileDetails, ProfileInfo } from '@/features/profile';
import { useAuthStore } from '@/store/auth.store';

import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const needsArticlesAmount = user?.articlesAmount === undefined;

  const profileQuery = useQuery({
    queryKey: ['profile', 'details', user?.id],
    enabled: Boolean(user?.id && needsArticlesAmount),
    queryFn: () => getProfileDetails(user!.id),
  });

  const articlesAmount = user?.articlesAmount ?? profileQuery.data?.articlesAmount;

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
          articlesAmount={articlesAmount}
          isArticlesAmountLoading={needsArticlesAmount && profileQuery.isPending}
        />
      ) : null}
    </header>
  );
}
