import Container from '../Container/Container';
import Button from '../Button/Button';
import styles from './SectionHeader.module.css';

// Плашка раздела главной во всю ширину: заголовок слева, «Показать еще» справа
export default function SectionHeader({ id, title, link, linkLabel = 'Показать еще' }) {
  return (
    <div className={styles['section-header']}>
      <Container className={styles['section-header__inner']}>
        <h2 id={id} className={styles['section-header__title']}>
          {title}
        </h2>
        {link && (
          <Button to={link} className={styles['section-header__button']} aria-label={`${linkLabel}: ${title}`}>
            {linkLabel}
          </Button>
        )}
      </Container>
    </div>
  );
}
