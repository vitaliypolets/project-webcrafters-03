// frontend\src\app\(auth)\login\page.tsx

import styles from './LoginPage.module.css';
import LoginForm from '@/features/auth/login/components/LoginForm/LoginForm';

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.loginTitle}>Login</h1>
      <LoginForm />
    </main>
  );
}
