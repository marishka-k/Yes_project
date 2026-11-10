import Icon from '../Icon/Icon';
import { cx } from '../../utils/cx';
import styles from './QuantityControl.module.css';

// Количество: − число +. В корзине «−» на единице удаляет позицию (min = 0)
export default function QuantityControl({ value, onChange, min = 1, max = 99, name = 'товара', className }) {
  return (
    <div className={cx(styles['quantity-control'], className)} role="group" aria-label={`Количество ${name}`}>
      <button
        type="button"
        className={styles['quantity-control__button']}
        onClick={() => onChange(Math.max(value - 1, min))}
        disabled={value <= min}
        aria-label="Уменьшить"
      >
        <Icon name="minus" width={16} />
      </button>
      <output className={styles['quantity-control__value']} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={styles['quantity-control__button']}
        onClick={() => onChange(Math.min(value + 1, max))}
        disabled={value >= max}
        aria-label="Увеличить"
      >
        <Icon name="plus" width={16} />
      </button>
    </div>
  );
}
