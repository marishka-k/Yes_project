import { useId } from 'react';
import Icon from '../Icon/Icon';
import { cx } from '../../utils/cx';
import styles from './Select.module.css';

// Выпадающий список из UI Kit (нативный select — работает с клавиатуры и на телефоне)
export default function Select({ label, options, value, onChange, className }) {
  const id = useId();
  return (
    <div className={cx(styles.select, className)}>
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <select id={id} className={styles.select__control} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <Icon name="arrow" width={15} className={styles.select__arrow} />
    </div>
  );
}
