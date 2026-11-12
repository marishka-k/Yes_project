import PageTitle from '../../PageTitle/PageTitle';
import { cx } from '../../../utils/cx';
import styles from './AdminPageHead.module.css';

// Заголовок страницы-списка: слева H2-стиль (40 Bold), справа действия («Добавить товар»)
export default function AdminPageHead({ title, children, className }) {
  return (
    <div className={cx(styles['admin-page-head'], className)}>
      <PageTitle className={styles['admin-page-head__title']}>{title}</PageTitle>
      {children && <div className={styles['admin-page-head__actions']}>{children}</div>}
    </div>
  );
}
