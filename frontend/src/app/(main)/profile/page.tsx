import { AuthGuard } from '@/features/auth/session';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <main className={styles.page}>
        <h1>ProfilePage</h1>
        <p>Заготовка сторінки відповідно до OWNERSHIP_MAP.md.</p>
      </main>
    </AuthGuard>
  );
}
