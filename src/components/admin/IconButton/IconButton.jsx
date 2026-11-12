import { Link } from 'react-router-dom';
import Icon from '../../Icon/Icon';
import { cx } from '../../../utils/cx';
import styles from './IconButton.module.css';

// Кнопка-иконка админки (корзина, карандаш, глаз) с подсказкой при наведении и фокусе —
// как плашки «Вернуть» / «Скрыть» в UI Kit. label — полное название для читалок, tip — короткая подсказка.
// С to — ссылка
export default function IconButton({ icon, label, tip = label, to, className, iconWidth = 22, ...rest }) {
  const content = (
    <>
      <Icon name={icon} width={iconWidth} />
      <span className={styles['icon-button__tip']} aria-hidden="true">
        {tip}
      </span>
    </>
  );
  const classes = cx(styles['icon-button'], className);
  if (to) {
    return (
      <Link to={to} className={classes} aria-label={label} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} aria-label={label} {...rest}>
      {content}
    </button>
  );
}
