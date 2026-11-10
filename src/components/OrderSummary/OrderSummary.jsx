import { colorById } from '../../data/categories';
import { productPhoto } from '../../utils/asset';
import { formatNumber } from '../../utils/format';
import { cx } from '../../utils/cx';
import styles from './OrderSummary.module.css';

// «Ваш заказ» на странице оформления: товары, доставка, скидки и сумма к оплате.
// children — согласия и кнопка «Оформить заказ» внизу панели
export default function OrderSummary({ lines, totals, promo, children }) {
  const rows = [
    { label: 'Доставка', value: `${formatNumber(totals.deliveryPrice)}₽` },
    totals.promoValue ? { label: `Промокод, ${promo}`, value: `-${formatNumber(totals.promoValue)}₽`, muted: true } : null,
    totals.online ? { label: 'Оплата онлайн', value: `-${formatNumber(totals.online)}₽`, muted: true } : null,
  ].filter(Boolean);

  return (
    <section className={styles['order-summary']} aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className={styles['order-summary__title']}>
        Ваш заказ
      </h2>
      <ul className={styles['order-summary__items']}>
        {lines.map((line) => (
          <li key={line.key} className={styles['order-summary__item']}>
            <img
              className={styles['order-summary__image']}
              src={productPhoto(line.product.images[0])}
              alt=""
              width="56"
              height="70"
              style={{ objectPosition: line.product.focus }}
            />
            <div className={styles['order-summary__info']}>
              <h3 className={styles['order-summary__name']}>
                {line.product.name}
                {line.qty > 1 && <span className={styles['order-summary__qty']}> × {line.qty}</span>}
              </h3>
              <dl className={styles['order-summary__props']}>
                {line.color && (
                  <div>
                    <dt>Цвет:</dt>
                    <dd>{colorById[line.color]?.name}</dd>
                  </div>
                )}
                {line.size && (
                  <div>
                    <dt>Размер:</dt>
                    <dd>{line.size}</dd>
                  </div>
                )}
              </dl>
            </div>
            <p className={styles['order-summary__price']}>{formatNumber(line.product.price * line.qty)}₽</p>
          </li>
        ))}
      </ul>

      <dl className={styles['order-summary__rows']}>
        {rows.map((row) => (
          <div key={row.label} className={styles['order-summary__row']}>
            <dt>{row.label}</dt>
            <dd className={cx(row.muted && styles['order-summary__value_muted'])}>{row.value}</dd>
          </div>
        ))}
        <div className={cx(styles['order-summary__row'], styles['order-summary__row_total'])}>
          <dt>С учетом скидок к оплате:</dt>
          <dd>{formatNumber(totals.total)}₽</dd>
        </div>
      </dl>

      <div className={styles['order-summary__footer']}>{children}</div>
    </section>
  );
}
