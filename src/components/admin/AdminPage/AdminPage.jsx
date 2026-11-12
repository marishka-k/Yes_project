import Container from '../../Container/Container';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import { cx } from '../../../utils/cx';
import styles from './AdminPage.module.css';

// Страница админки: хлебные крошки, слева меню разделов (с 1024 px), справа содержимое.
// sidebar={false} — страницы формы товара: в макете слева там фото, а не меню
export default function AdminPage({ crumbs, sidebar = true, className, children }) {
  return (
    <Container className={cx(styles['admin-page'], className)}>
      <Breadcrumbs items={crumbs} />
      <div className={cx(styles['admin-page__body'], sidebar && styles['admin-page__body_with-sidebar'])}>
        {sidebar && <AdminSidebar className={styles['admin-page__sidebar']} />}
        <div className={styles['admin-page__content']}>{children}</div>
      </div>
    </Container>
  );
}
