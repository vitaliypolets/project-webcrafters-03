import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import styles from '@/components/layout/MainLayout.module.css';

// import { AuthHeader } from '@/components/AuthHeader';
// Розкоментувати рядок вище тому, хто робить хедер —
// щоб на сторінках авторизації рендерилося лише логотип (згідно з п. 14 ТЗ).

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrapper}>
      {/* <AuthHeader /> */}
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
