import { useState } from 'react';
import Button from '../Button/Button';
import FormField from '../FormField/FormField';
import { useStore } from '../../store/StoreContext';
import { checkPromo, itemsCount, orderTotals } from '../../utils/order';
import { formatNumber } from '../../utils/format';
import { cx } from '../../utils/cx';
import styles from './CartSummary.module.css';

// Блок справа от корзины: промокод и «Информация о заказе»
export default function CartSummary({ lines }) {
  const { promo, setPromo } = useStore();
  const [code, setCode] = useState(promo);
  const [message, setMessage] = useState(null);
  const totals = orderTotals(lines, { promo });

  const applyPromo = (event) => {
    event.preventDefault();
    const result = checkPromo(code, totals.goods);
    setMessage(result);
    setPromo(result.ok ? code.trim().toUpperCase() : '');
  };

  const rows = [
    { label: `Товары (${itemsCount(lines)})`, value: `${formatNumber(totals.full)} ₽` },
    { label: 'Скидка', value: `- ${formatNumber(totals.discount)} ₽`, muted: true },
    { label: 'Промокод', value: `- ${formatNumber(totals.promoValue)} ₽`, muted: true, line: true },
  ];

  return (
    <aside className={styles['cart-summary']} aria-label="Итог заказа">
      <form className={styles['cart-summary__promo']} onSubmit={applyPromo}>
        <h2 className={styles['cart-summary__title']}>Промокод:</h2>
        <FormField
          label="Промокод"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          error={message && !message.ok ? message.message : null}
          autoComplete="off"
        />
        {message?.ok && <p className={styles['cart-summary__ok']}>{message.message}</p>}
        <Button type="submit" className={styles['cart-summary__apply']}>
          Применить
        </Button>
      </form>

      <h2 className={styles['cart-summary__title']}>Информация о заказе:</h2>
      <dl className={styles['cart-summary__rows']}>
        {rows.map((row) => (
          <div key={row.label} className={cx(styles['cart-summary__row'], row.line && styles['cart-summary__row_line'])}>
            <dt>{row.label}</dt>
            <dd className={cx(styles['cart-summary__value'], row.muted && styles['cart-summary__value_muted'])}>{row.value}</dd>
          </div>
        ))}
        <div className={cx(styles['cart-summary__row'], styles['cart-summary__row_total'])}>
          <dt>Общая сумма:</dt>
          <dd className={styles['cart-summary__value']}>{formatNumber(totals.goods - totals.promoValue)} ₽</dd>
        </div>
      </dl>

      <Button to="/checkout" wide className={styles['cart-summary__checkout']}>
        Перейти к оформлению
      </Button>
    </aside>
  );
}
