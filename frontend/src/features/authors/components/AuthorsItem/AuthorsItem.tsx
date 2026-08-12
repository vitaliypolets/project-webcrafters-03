import Image from 'next/image';
import Link from 'next/link';

import type { PublicUser } from '@/types/user';
import { getAvatarSrc } from '@/utils/getAvatarSrc';
import styles from './AuthorsItem.module.css';

type AuthorsItemProps = {
  author: PublicUser;
};

export default function AuthorsItem({ author }: AuthorsItemProps) {
  const firstName = author.name.split(' ')[0];
  return (
    <Link href={`/authors/${author.id}`} className={styles.item}>
      <Image
        src={getAvatarSrc(author.avatarUrl)}
        alt={author.name}
        width={148}
        height={148}
        loading="eager"
        className={styles.avatar}
      />

      <p className={styles.name}>{firstName}</p>
    </Link>
  );
}
