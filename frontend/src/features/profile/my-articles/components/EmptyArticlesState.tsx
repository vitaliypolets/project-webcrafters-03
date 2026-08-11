import Image from 'next/image';
import Link from 'next/link';
import alertIcon from '../assets/alert.svg';
import styles from './ArticlesTab.module.css';

type EmptyArticlesStateProps = {
  description: string;
  actionLabel: string;
  href: string;
};

export function EmptyArticlesState({ description, actionLabel, href }: EmptyArticlesStateProps) {
  return (
    <div className={styles.emptyState}>
      <span className={styles.alertIcon} aria-hidden="true">
        <Image src={alertIcon} width={40} height={40} alt="" />
      </span>
      <h2>Nothing found.</h2>
      <p>{description}</p>
      <Link className={styles.emptyAction} href={href}>
        {actionLabel}
      </Link>
    </div>
  );
}
