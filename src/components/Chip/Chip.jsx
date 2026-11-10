import Icon from '../Icon/Icon';
import { cx } from '../../utils/cx';
import styles from './Chip.module.css';

// Плашки из UI Kit.
// option — переключатель (категории, размеры, цвета): «Не выбрана» / «Выбрана»;
// tag — выбранный фильтр с крестиком: нажатие снимает фильтр
export default function Chip({ variant = 'option', selected = false, onClick, className, children, label, ...rest }) {
  if (variant === 'tag') {
    return (
      <button type="button" className={cx(styles.chip, styles.chip_variant_tag, className)} onClick={onClick} {...rest}>
        {children}
        <Icon name="close" width={16} />
        <span className="visually-hidden">— снять фильтр</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      className={cx(styles.chip, styles.chip_variant_option, selected && styles.chip_selected, className)}
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
