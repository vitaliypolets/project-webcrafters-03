import styles from './PhotoPage.module.css';
import { GuestGuard } from '@/features/auth/session';

export default function PhotoPage() {
  return (
    <GuestGuard>
      <main className={styles.page}>
        <h1>PhotoPage</h1>
        <p>Заготовка сторінки відповідно до OWNERSHIP_MAP.md.</p>
      </main>
    </GuestGuard>
  );
}
