"use client";

import Link from "next/link";
import css from "./Header.module.css";
import { useAuthStore } from "@/store/auth.store";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import LogoutUserModalClient from "@/features/user/user-bar/components/LogoutModal/LogoutUserModal.client";
import { Container } from "../ui/Container/Container"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const pathname = usePathname();
  const getLinkClass = (path: string) => {
    return pathname === path ? `${css.navigationLink} ${css.active}` : css.navigationLink;
  };

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const handleBurger = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <header className={css.header}>
        <Container>
        <div className={css.headerWrapper}>
          <Link
            onClick={() => setIsOpen(false)}
            href="/"
            className={css.headerLink}
            aria-label="Home"
          >
            <svg className={css.logoIcon}>
              <use href="/icons/sprite.svg#icon-logo" />
            </svg>
          </Link>
          <div className={css.navigationDescFild}>
            <nav aria-label="Main Navigation">
              <ul className={css.navigationDesc}>
                <li className={css.navigationItemDesc}>
                  <Link onClick={() => setIsOpen(false)} href="/" className={getLinkClass("/")}>
                    Home
                  </Link>
                </li>

                <li className={css.navigationItemDesc}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/articles"
                    className={getLinkClass("/articles")}
                  >
                    Articles
                  </Link>
                </li>

                <li className={css.navigationItemDesc}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/authors"
                    className={getLinkClass("/authors")}
                  >
                    Creators
                  </Link>
                </li>
                

                {isAuthenticated ? (
                  <>
                    <li className={css.navigationItemDesc}>
                      <Link
                        onClick={() => setIsOpen(false)}
                        href="/profile"
                        prefetch={false}
                        className={getLinkClass("/profile")}
                      >
                        My Profile
                      </Link>
                    </li>

                    <li className={css.navigationItem}>
                      <Link
                        onClick={() => setIsOpen(false)}
                        href="/articles/create"
                        prefetch={false}
                        className={css.navigationLinkJoinDesc}
                      >
                        Create an article
                      </Link>
                    </li>

                    <li className={css.userFieldDesc}>
                      <div className={css.userFieldFirst}>
                      <Image className={css.userAvatar} src={user?.avatarUrl || "/images/default-avatar.png"} width={40} height={40} alt={user?.name || "User name"}/>

                        <p className={css.userName}>{user?.email}</p>
                      </div>
                     <button
  type="button"
  onClick={() => setIsLogoutOpen(true)}
  className={css.logoutButton}
  aria-label="Log out"
>
  <svg className={css.icon} width="24" height="24">
    <use href="/icons/sprite.svg#icon-log-out" />
  </svg>
</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className={css.navigationItemDesc}>
                      <Link
                        onClick={() => setIsOpen(false)}
                        href="/login"
                        prefetch={false}
                        className={getLinkClass("/login")}
                      >
                        Log in
                      </Link>
                    </li>

                    <li className={css.navigationItem}>
                      <Link
                        onClick={() => setIsOpen(false)}
                        href="/register"
                        prefetch={false}
                        className={css.navigationLinkJoinDesc}
                      >
                        Join now
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
            <div>
              <button className={css.navBarMobButton} type="button" onClick={handleBurger}>
                {isOpen ? (
                  <>
                    <svg className={css.icon}>
                      <use href="/icons/sprite.svg#icon-close" />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg className={css.icon}>
                      <use href="/icons/sprite.svg#icon-burger" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        </Container>
      </header>
      <Container>
      <div className={isOpen ? `${css.navBarMob} ${css.isOpen}` : css.navBarMob}>
        <nav aria-label="Main Navigation">
          <ul className={css.navigation}>
            <li className={css.navigationItem}>
              <Link onClick={() => setIsOpen(false)} href="/" className={getLinkClass("/")}>
                Home
              </Link>
            </li>

            <li className={css.navigationItem}>
              <Link
                onClick={() => setIsOpen(false)}
                href="/articles"
                className={getLinkClass("/articles")}
              >
                Articles
              </Link>
            </li>

            <li className={css.navigationItem}>
              <Link
                onClick={() => setIsOpen(false)}
                href="/authors"
                className={getLinkClass("/authors")}
              >
                Creators
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className={css.navigationItem}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/profile"
                    prefetch={false}
                    className={getLinkClass("/profile")}
                  >
                    My Profile
                  </Link>
                </li>

                <li className={css.navigationItem}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/articles/create"
                    prefetch={false}
                    className={css.navigationLinkJoin}
                  >
                    Create an article
                  </Link>
                </li>

                <li className={css.userField}>
                  <div className={css.userFieldFirst}>
                    <Image className={css.userAvatar} src={user?.avatarUrl || "/avatar.png"} width={40} height={40} alt={user?.name || "User name"}/>
                    <p className={css.userName}>{user?.email}</p>
                  </div>

                 <button
  type="button"
  onClick={() => setIsLogoutOpen(true)}
  className={css.logoutButton}
  aria-label="Log out"
>
  <svg className={css.icon} width="24" height="24">
    <use href="/icons/sprite.svg#icon-log-out" />
  </svg>
</button>
                </li>
              </>
            ) : (
              <>
                <li className={css.navigationItem}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/login"
                    prefetch={false}
                    className={getLinkClass("/login")}
                  >
                    Log in
                  </Link>
                </li>

                <li className={css.navigationItem}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/"
                    prefetch={false}
                    className={css.navigationLinkJoin}
                  >
                    Join now
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      </Container>
      <LogoutUserModalClient
  isOpen={isLogoutOpen}
  onClose={() => setIsLogoutOpen(false)}
/>

    </>
  );
}
