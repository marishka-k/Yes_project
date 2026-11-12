import { useCatalog } from '../../../store/CatalogContext';
import { productById as baseProductById } from '../../../data/products';
import { colorById } from '../../../data/categories';
import { productPhoto } from '../../../utils/asset';
import { formatPrice } from '../../../utils/format';
import { cx } from '../../../utils/cx';
import styles from './OrderComposition.module.css';

// «Состав заказа» из макета order info: позиции с фото, цветом и размером,
// строки доставки, промокода и скидки за оплату онлайн, итог в рамке
export default function OrderComposition({ order }) {
  const { allProductById } = useCatalog();
  const { totals } = order;
  const rows = [
    ['Доставка', formatPrice(totals.deliveryPrice)],
    ...(totals.promoValue ? [[`Промокод, ${order.promo}`, `−${formatPrice(totals.promoValue)}`]] : []),
    ...(totals.online ? [['Оплата онлайн', `−${formatPrice(totals.online)}`]] : []),
  ];

  return (
    <div className={styles['order-composition']}>
      <ul className={styles['order-composition__items']}>
        {order.items.map((item) => {
          // Фото — из каталога (если товар удалён — из базовых данных)
          const product = allProductById[item.id] || baseProductById[item.id];
          return (
            <li key={`${item.id}|${item.size}|${item.color}`} className={styles['order-composition__item']}>
              {product ? (
                <img className={styles['order-composition__photo']} src={productPhoto(product.images[0])} alt="" style={{ objectPosition: product.focus }} />
              ) : (
                <span className={styles['order-composition__photo']} />
              )}
              <div className={styles['order-composition__info']}>
                <p className={styles['order-composition__name']}>{item.name}</p>
                <dl className={styles['order-composition__specs']}>
                  <div>
                    <dt>Цвет:</dt>
                    <dd>{colorById[item.color]?.name || '—'}</dd>
                  </div>
                  {item.size && (
                    <div>
                      <dt>Размер:</dt>
                      <dd>{item.size}</dd>
                    </div>
                  )}
                  {item.qty > 1 && (
                    <div>
                      <dt>Количество:</dt>
                      <dd>{item.qty}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <p className={styles['order-composition__price']}>{formatPrice(item.price * item.qty)}</p>
            </li>
          );
        })}
      </ul>

      <dl className={styles['order-composition__rows']}>
        {rows.map(([label, value]) => (
          <div key={label} className={styles['order-composition__row']}>
            <dt>{label}</dt>
            <dd className={styles['order-composition__row-value']}>{value}</dd>
          </div>
        ))}
        <div className={cx(styles['order-composition__row'], styles['order-composition__row_total'])}>
          <dt>С учетом скидок к оплате:</dt>
          <dd>{formatPrice(totals.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
