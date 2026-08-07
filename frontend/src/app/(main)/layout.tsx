import type { ReactNode } from 'react';
export default function MainLayout({ children }: { children: ReactNode }) {
  return <>{/* Header owner №5 */}<div>{children}</div>{/* Footer owner №4 */}</>;
}
