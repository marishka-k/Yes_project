import { cx } from '../../utils/cx';
import styles from './Container.module.css';

// Ширина страницы: 1240 px контента на 1440 + поля по токену --page-pad
export default function Container({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cx(styles.container, className)} {...rest}>
      {children}
    </Tag>
  );
}
