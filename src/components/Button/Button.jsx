import { Link } from 'react-router-dom';
import { cx } from '../../utils/cx';
import styles from './Button.module.css';

// Кнопки из UI Kit: primary — акцентная заливка, secondary — светлая с обводкой.
// size: s — 16 Bold (карточки, формы), l — крупная (В корзину, Оформить заказ).
// Если передан to — рендерится ссылкой
export default function Button({ to, variant = 'primary', size = 's', wide = false, className, children, ...rest }) {
  const classes = cx(
    styles.button,
    styles[`button_variant_${variant}`],
    styles[`button_size_${size}`],
    wide && styles.button_wide,
    className,
  );
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
