import { cx } from '../../utils/cx';
import styles from './PageTitle.module.css';

// Заголовок страницы (H1 по смыслу, стиль H2 из UI Kit — 40 Bold по центру)
export default function PageTitle({ as: Tag = 'h1', className, children, ...rest }) {
  return (
    <Tag className={cx(styles['page-title'], className)} {...rest}>
      {children}
    </Tag>
  );
}
