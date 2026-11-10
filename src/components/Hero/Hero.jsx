import Container from '../Container/Container';
import { asset } from '../../utils/asset';
import { hero } from '../../data/content';
import styles from './Hero.module.css';

// Первый экран: фото во всю ширину, справа заголовок «Your Endless Summer» (H1 96 ExtraBold)
export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <img className={styles.hero__image} src={asset(hero.image)} alt={hero.alt} width="2000" height="1251" fetchpriority="high" />
      <Container className={styles.hero__content}>
        <h1 id="hero-title" className={styles.hero__title}>
          {hero.title.map((line) => (
            <span key={line} className={styles.hero__line}>
              {line}
            </span>
          ))}
        </h1>
      </Container>
    </section>
  );
}
