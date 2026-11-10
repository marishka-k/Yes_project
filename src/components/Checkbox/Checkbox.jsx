import Icon from '../Icon/Icon';
import { cx } from '../../utils/cx';
import styles from './Checkbox.module.css';

// Чекбокс из UI Kit: пустой — тёмная рамка, выбранный — акцентная рамка и галочка
export default function Checkbox({ checked, onChange, children, invalid = false, className, ...rest }) {
  return (
    <label className={cx(styles.checkbox, className)}>
      <input
        className={styles.checkbox__input}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-invalid={invalid ? 'true' : undefined}
        {...rest}
      />
      <span className={cx(styles.checkbox__box, invalid && styles.checkbox__box_invalid)} aria-hidden="true">
        <Icon name="check" width={16} className={styles.checkbox__check} />
      </span>
      <span className={styles.checkbox__label}>{children}</span>
    </label>
  );
}
