import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import styles from './Footer.module.css';

const NAV_LINKS = [
  { label: 'Articles', href: '/articles' },
  { label: 'Account', href: '/profile' },
];

const AUTH_NAV_LINKS = [{ label: 'Articles', href: '/articles' }];

interface FooterProps {
  isAuthPage?: boolean;
}

export function Footer({ isAuthPage = false }: FooterProps) {
  const navLinks = isAuthPage ? AUTH_NAV_LINKS : NAV_LINKS;

  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        {/* Логотип */}
        <Link
          href="/"
          className={styles.logoLink}
          aria-label="Harmoniq Home"
        >
          <svg
            className={styles.logoIcon}
            width={165}
            height={46}
          >
            <use href="/icons/sprite.svg#icon-logo" />
          </svg>
        </Link>

        {/* Копірайт */}
        <p className={styles.copyright}>© 2025 Harmoniq. All rights reserved.</p>

        {/* Навігація */}
        <nav
          className={styles.nav}
          aria-label="Footer Navigation"
        >
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li
                key={link.href}
                className={styles.navItem}
              >
                <Link
                  href={link.href}
                  className={styles.navLink}
                  scroll={true}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
