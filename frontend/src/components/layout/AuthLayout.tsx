import type { ReactNode } from 'react';

// import AuthHeader from '../../components/Header/AuthHeader';
import { Footer } from '@/components/Footer';

import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.wrapper}>
      {/* <AuthHeader /> */}

      <main className={styles.main}>{children}</main>

      <Footer isAuthPage />
    </div>
  );
}
