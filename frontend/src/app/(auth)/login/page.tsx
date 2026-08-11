// frontend\src\app\(auth)\login\page.tsx

import { GuestGuard } from '@/features/auth/session';
import styles from './LoginPage.module.css';
import LoginForm from '@/features/auth/login/components/LoginForm/LoginForm';
import Header from '@/components/Header/Header';
import { Footer } from '@/components/Footer';

export default function LoginPage() {
  return (
    <GuestGuard>
      <Header />
      <main className={styles.page}>
        <h1 className={styles.loginTitle}>Login</h1>
        <LoginForm />
      </main>
      <Footer />
    </GuestGuard>
  );
}
