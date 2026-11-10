import { useId } from 'react';
import { cx } from '../../utils/cx';
import styles from './FormField.module.css';

// Поле ввода из UI Kit: в макете подпись — это placeholder, поэтому label скрыт визуально,
// но доступен экранным читалкам. Ошибка — красная обводка и текст под полем
export default function FormField({ label, error, hideLabel = true, className, multiline = false, ...inputProps }) {
  const id = useId();
  const errorId = `${id}-error`;
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className={cx(styles['form-field'], className)}>
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : styles['form-field__label']}>
        {label}
      </label>
      <Tag
        id={id}
        className={cx(styles['form-field__input'], error && styles['form-field__input_invalid'])}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        placeholder={label}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className={styles['form-field__error']}>
          {error}
        </p>
      )}
    </div>
  );
}
