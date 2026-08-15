import Image from 'next/image';
import css from '../../../../../components/Header/Header.module.css';
import type { User } from '@/types/user';
import Link from 'next/link';
type UserBarProps = {
  user: User | null;
  setIsLogoutOpen: (isOpen: boolean) => void;
  userField: string;
};
export default function UserBar({ user, setIsLogoutOpen, userField }: UserBarProps) {
  return (
    <>
      <li className={css[userField]}>
        <div className={css.userFieldFirst}>
          <Link
            href="/profile"
            prefetch={false}
            className={css.avatarLink}
          >
            <Image
              className={css.userAvatar}
              src={user?.avatarUrl || '/images/default-avatar.png'}
              width={40}
              height={40}
              alt={user?.name || 'User name'}
            />
          </Link>

          <p className={css.userName}>{user?.name}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsLogoutOpen(true)}
          className={css.logoutButton}
          aria-label="Log out"
        >
          <svg
            className={css.icon}
            width="24"
            height="24"
          >
            <use href="/icons/sprite.svg#icon-log-out" />
          </svg>
        </button>
      </li>
    </>
  );
}
