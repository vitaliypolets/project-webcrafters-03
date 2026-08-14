import Image from 'next/image';
import Link from 'next/link';
import heroBg from './assets/hero-background.png';
import styles from './Hero.module.css';

export const Hero = () => {
  return (
    <section className={styles.heroSection}>
        <div className={styles.imageWrapper}>
          <Image
            src={heroBg}
            alt="Person sitting peacefully in nature"
            priority
            placeholder="blur"
            className={styles.heroImage}
          />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>
            Find your <span className={styles.italic}>harmony</span> in community
          </h1>

          <div className={styles.buttons}>
            <Link
              href="/articles"
              className={styles.btnPrimary}
            >
              Go to Articles
            </Link>
            <Link
              href="/register"
              className={styles.btnSecondary}
            >
              Register
            </Link>
          </div>
      </div>
    </section>
  );
};
