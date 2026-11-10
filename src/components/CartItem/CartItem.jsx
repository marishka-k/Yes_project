import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon';
import QuantityControl from '../QuantityControl/QuantityControl';
import { colorById } from '../../data/categories';
import { productPhoto } from '../../utils/asset';
import { formatNumber } from '../../utils/format';
import styles from './CartItem.module.css';

// Позиция корзины: фото, название, цвет и размер, количество, цена без скидки, скидка, удалить
export default function CartItem({ line, onQty, onRemove }) {
  const { product, qty } = line;
  const full = (product.oldPrice || product.price) * qty;
  const discount = product.oldPrice ? (product.oldPrice - product.price) * qty : 0;
  const url = `/product/${product.id}`;

  return (
    <article className={styles['cart-item']}>
      <Link to={url} className={styles['cart-item__media']} tabIndex={-1} aria-hidden="true">
        <img className={styles['cart-item__image']} src={productPhoto(product.images[0])} alt="" width="181" height="232" style={{ objectPosition: product.focus }} />
      </Link>
      <div className={styles['cart-item__info']}>
        <h3 className={styles['cart-item__title']}>
          <Link to={url} className={styles['cart-item__link']}>
            {product.name}
          </Link>
        </h3>
        <dl className={styles['cart-item__props']}>
          {line.color && (
            <div className={styles['cart-item__prop']}>
              <dt>Цвет:</dt>
              <dd>{colorById[line.color]?.name}</dd>
            </div>
          )}
          {line.size && (
            <div className={styles['cart-item__prop']}>
              <dt>Размер:</dt>
              <dd>{line.size}</dd>
            </div>
          )}
        </dl>
      </div>
      <QuantityControl className={styles['cart-item__qty']} value={qty} min={1} onChange={(value) => onQty(line.key, value)} name={product.name} />
      <p className={styles['cart-item__price']}>
        <span className="visually-hidden">Цена без скидки: </span>
        {formatNumber(full)}₽
      </p>
      <p className={styles['cart-item__discount']}>
        <span className="visually-hidden">Скидка: </span>
        {discount ? `-${formatNumber(discount)}` : '0'}₽
      </p>
      <button type="button" className={styles['cart-item__remove']} onClick={() => onRemove(line.key)} aria-label={`Удалить «${product.name}» из корзины`}>
        <Icon name="trash" width={18} />
      </button>
    </article>
  );
}
