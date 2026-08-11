import styles from './RegisterPage.module.css';
import { GuestGuard } from '@/features/auth/session';

export default function RegisterPage() {
  return (
    <GuestGuard>
      <main className={styles.page}>
        <h1>RegisterPage</h1>
        <p>Заготовка сторінки відповідно до OWNERSHIP_MAP.md.</p>
      </main>
    </GuestGuard>
  );
}
