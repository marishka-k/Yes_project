import { useId } from 'react';
import { cx } from '../../utils/cx';
import styles from './FormField.module.css';

// Поле ввода из UI Kit: в макете подпись — это placeholder, поэтому label скрыт визуально,
// но доступен экранным читалкам. Ошибка — красная обводка и текст под полем.
// layout="row" — подпись видна слева от поля (форма товара в админке); ширины задают
// переменные --form-label-w и --form-control-w из модуля страницы
export default function FormField({ label, error, hideLabel = true, layout = 'stack', className, multiline = false, ...inputProps }) {
  const isRow = layout === 'row';
  const id = useId();
  const errorId = `${id}-error`;
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className={cx(styles['form-field'], isRow && styles['form-field_layout_row'], className)}>
      <label htmlFor={id} className={hideLabel && !isRow ? 'visually-hidden' : styles['form-field__label']}>
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
