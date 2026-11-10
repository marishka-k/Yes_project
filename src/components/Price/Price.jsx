import { formatPrice } from '../../utils/format';
import { cx } from '../../utils/cx';
import styles from './Price.module.css';

// Цена и зачёркнутая прошлая цена (Past price из UI Kit).
// size: card — в карточке (Body), l — на странице товара (H3 + Past price), s — в заказе (Past price order)
export default function Price({ value, old, size = 'card', className }) {
  return (
    <p className={cx(styles.price, styles[`price_size_${size}`], className)}>
      <span className={styles.price__value}>
        {old ? <span className="visually-hidden">Цена со скидкой: </span> : null}
        {formatPrice(value)}
      </span>
      {old ? (
        <s className={styles.price__old}>
          <span className="visually-hidden">Без скидки: </span>
          {formatPrice(old)}
        </s>
      ) : null}
    </p>
  );
}
