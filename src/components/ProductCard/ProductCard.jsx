import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import Price from '../Price/Price';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import { productPhoto } from '../../utils/asset';
import styles from './ProductCard.module.css';

// Карточка товара из UI Kit: фото, сердечко, название (до 2 строк), цена и «Открыть».
// Цена и кнопка прижаты к низу — в ряду карточек они на одном уровне
export default function ProductCard({ product }) {
  const url = `/product/${product.id}`;
  return (
    <article className={styles['product-card']}>
      <Link to={url} className={styles['product-card__media']} tabIndex={-1} aria-hidden="true">
        <img
          className={styles['product-card__image']}
          src={productPhoto(product.images[0])}
          alt=""
          loading="lazy"
          width="286"
          height="251"
          style={{ objectPosition: product.focus }}
        />
      </Link>
      <FavoriteButton id={product.id} name={product.name} className={styles['product-card__favorite']} />
      <div className={styles['product-card__body']}>
        <h3 className={styles['product-card__title']}>
          <Link to={url} className={styles['product-card__link']}>
            {product.name}
          </Link>
        </h3>
        <div className={styles['product-card__bottom']}>
          <Price value={product.price} old={product.oldPrice} />
          <Button to={url} className={styles['product-card__button']} tabIndex={-1} aria-hidden="true">
            Открыть
          </Button>
        </div>
      </div>
    </article>
  );
}
