import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';
import heroBg from './hero-background.png';

export const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Find your <span className={styles.italic}>harmony</span> in community
          </h1>

          <div className={styles.buttons}>
            <Link href="/articles" className={styles.btnPrimary}>
              Go to Articles
            </Link>
            <Link href="/register" className={styles.btnSecondary}>
              Register
            </Link>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            width={806}
            height={562}
            src={heroBg}
            alt="Person sitting in nature"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
};
