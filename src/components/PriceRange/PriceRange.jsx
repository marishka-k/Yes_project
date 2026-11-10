import { useId } from 'react';
import { formatNumber } from '../../utils/format';
import styles from './PriceRange.module.css';

const STEP = 500;

// Цена «От / До»: два поля и двойной ползунок (два input range поверх одной дорожки)
export default function PriceRange({ min, max, from, to, onChange }) {
  const id = useId();
  const toNumber = (text) => Number(String(text).replace(/\D/g, '')) || 0;
  const left = ((from - min) / (max - min)) * 100;
  const right = ((to - min) / (max - min)) * 100;

  const setFrom = (value) => onChange(Math.min(Math.max(value, min), to), to);
  const setTo = (value) => onChange(from, Math.max(Math.min(value, max), from));

  return (
    <div className={styles['price-range']}>
      <div className={styles['price-range__fields']}>
        <label className={styles['price-range__field']} htmlFor={`${id}-from`}>
          <span>От</span>
          <input
            id={`${id}-from`}
            className={styles['price-range__input']}
            inputMode="numeric"
            value={formatNumber(from)}
            onChange={(event) => onChange(Math.min(toNumber(event.target.value), max), to)}
            onBlur={() => setFrom(from)}
          />
        </label>
        <label className={styles['price-range__field']} htmlFor={`${id}-to`}>
          <span>До</span>
          <input
            id={`${id}-to`}
            className={styles['price-range__input']}
            inputMode="numeric"
            value={formatNumber(to)}
            onChange={(event) => onChange(from, Math.min(toNumber(event.target.value), max))}
            onBlur={() => setTo(to)}
          />
        </label>
      </div>

      <div className={styles['price-range__slider']}>
        <div className={styles['price-range__track']}>
          <span className={styles['price-range__fill']} style={{ left: `${left}%`, right: `${100 - right}%` }} />
        </div>
        <input
          className={styles['price-range__thumb']}
          type="range"
          min={min}
          max={max}
          step={STEP}
          value={from}
          onChange={(event) => setFrom(Number(event.target.value))}
          aria-label="Цена от"
        />
        <input
          className={styles['price-range__thumb']}
          type="range"
          min={min}
          max={max}
          step={STEP}
          value={to}
          onChange={(event) => setTo(Number(event.target.value))}
          aria-label="Цена до"
        />
      </div>
    </div>
  );
}
