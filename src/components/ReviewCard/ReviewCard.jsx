import Rating from '../Rating/Rating';
import styles from './ReviewCard.module.css';

// Отзыв покупателя: имя, звёзды, текст (до 6 строк с многоточием)
export default function ReviewCard({ review }) {
  return (
    <article className={styles['review-card']}>
      <header className={styles['review-card__head']}>
        <h3 className={styles['review-card__author']}>{review.author}</h3>
        <Rating value={review.rating} />
      </header>
      <p className={styles['review-card__text']}>{review.text}</p>
    </article>
  );
}
