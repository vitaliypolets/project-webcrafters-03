import type { ReactNode } from 'react';
// import { AuthHeader } from '@/components/AuthHeader'; // розкоментувати цю лінію тому хто робить хедер - щоб на сторінках авторизації рендерилося лише логотип (згідно з п. 14 ТЗ).

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* <AuthHeader /> */}
      <main>{children}</main>
    </div>
  );
}
