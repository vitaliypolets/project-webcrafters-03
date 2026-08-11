import Image from 'next/image';
import Link from 'next/link';

import type { PublicUser } from '@/types/user';

import styles from './AuthorsItem.module.css';

type AuthorsItemProps = {
  author: PublicUser;
};

export default function AuthorsItem({ author }: AuthorsItemProps) {
  const firstName = author.name.split(' ')[0];
  return (
    <Link href={`/authors/${author.id}`} className={styles.item}>
      <Image
        src={author.avatarUrl || '/images/default-avatar.png'}
        alt={author.name}
        width={148}
        height={148}
        className={styles.avatar}
      />

      <p className={styles.name}>{firstName}</p>
    </Link>
  );
}
