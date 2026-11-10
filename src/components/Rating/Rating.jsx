import Icon from '../Icon/Icon';
import styles from './Rating.module.css';

// Звёзды отзыва: заполненные — акцентные, пустые — светлые (UI Kit)
export default function Rating({ value, max = 5 }) {
  return (
    <span className={styles.rating} role="img" aria-label={`Оценка ${value} из ${max}`}>
      {Array.from({ length: max }, (_, index) => (
        <Icon key={index} name="star" width={24} className={index < value ? styles.rating__star_filled : styles.rating__star} />
      ))}
    </span>
  );
}
