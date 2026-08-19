import Link from 'next/link';

import { Container } from '@/components/ui/Container/Container';
import styles from './Footer.module.css';

const NAV_LINKS = [
  {
    label: 'Articles',
    href: '/articles#articles-top',
  },
  {
    label: 'Account',
    href: '/profile',
  },
];

const AUTH_NAV_LINKS = [
  {
    label: 'Articles',
    href: '/articles#articles-top',
  },
];

interface FooterProps {
  isAuthPage?: boolean;
}

export function Footer({ isAuthPage = false }: FooterProps) {
  const navLinks = isAuthPage ? AUTH_NAV_LINKS : NAV_LINKS;

  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
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

        <p className={styles.copyright}>
          © 2025 Harmoniq. All rights reserved.
        </p>

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