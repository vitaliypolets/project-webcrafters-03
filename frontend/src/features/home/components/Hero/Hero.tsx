import Image from "next/image";

import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";

import heroBgDesktop from "./assets/hero-background.png";
import heroBgMobile from "./assets/hero-background-mobile.png";
import styles from "./Hero.module.css";

export const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <Container className={styles.heroContainer}>
        <div className={styles.imageWrapperMobile}>
          <Image
            src={heroBgMobile}
            sizes="100vw"
            alt="Person sitting peacefully in nature"
            priority
            placeholder="blur"
            className={styles.heroImage}
          />
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={heroBgDesktop}
            sizes="100vw"
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
            <Button href="#popular-articles" variant="primary" size="xl" className={styles.heroButton}>
              Go to Articles
            </Button>
            <Button href="/register" variant="secondary" size="xl" className={`${styles.heroButton} ${styles.registerButton}`}>
              Register
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
