import Image from 'next/image';
import lotus from './about-lotus.png';
import friends from './about-friends.png';
import meditation from './about-meditation.png';

import styles from './About.module.css';

export const About = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.textCard}>
            <h2 className={styles.title}>About us</h2>
            <p className={styles.description}>
              Harmoniq is a mindful publishing platform dedicated to mental health and well-being.
              We bring together writers, thinkers, and readers who believe that open, thoughtful
              stories can heal, inspire, and connect. Whether you’re here to share your journey or
              learn from others — this is your space to slow down, reflect, and grow.
            </p>
          </div>

          <div className={`${styles.imageCard} ${styles.imageLotus}`}>
            <Image
              src={lotus}
              width={704}
              height={326}
              alt="Lotus flower"
              className={styles.image}
            />
          </div>

          <div className={`${styles.imageCard} ${styles.imageFriends}`}>
            <Image
              src={friends}
              width={808}
              height={398}
              alt="Friends at sunset"
              className={styles.image}
            />
          </div>

          <div className={`${styles.imageCard} ${styles.imageMeditation}`}>
            <Image
              src={meditation}
              width={392}
              height={398}
              alt="Person meditating"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
