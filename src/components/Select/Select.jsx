import { useId } from 'react';
import Icon from '../Icon/Icon';
import { cx } from '../../utils/cx';
import styles from './Select.module.css';

// Выпадающий список из UI Kit (нативный select — работает с клавиатуры и на телефоне).
// placeholder — пустой первый пункт («Категория товара»), error — красная обводка и текст под полем.
// layout="row" — подпись видна слева (форма товара в админке), как у FormField
export default function Select({ label, options, value, onChange, placeholder, error, layout = 'stack', className, ...rest }) {
  const id = useId();
  const errorId = `${id}-error`;
  const isRow = layout === 'row';
  return (
    <div className={cx(styles.select, isRow && styles.select_layout_row, className)}>
      <label className={isRow ? styles.select__label : 'visually-hidden'} htmlFor={id}>
        {label}
      </label>
      <div className={styles.select__box}>
        <select
          id={id}
          className={cx(styles.select__control, !value && placeholder && styles.select__control_empty, error && styles.select__control_invalid)}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <Icon name="arrow" width={15} className={styles.select__arrow} />
      </div>
      {error && (
        <p id={errorId} className={styles.select__error}>
          {error}
        </p>
      )}
    </div>
  );
}
