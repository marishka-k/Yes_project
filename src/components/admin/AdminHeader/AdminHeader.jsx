import { Link } from 'react-router-dom';
import Container from '../../Container/Container';
import Logo from '../../Logo/Logo';
import Icon from '../../Icon/Icon';
import styles from './AdminHeader.module.css';

// Шапка админки по макету: логотип слева, аватар администратора справа.
// Бургер — только до 1023 px (открывает меню разделов)
export default function AdminHeader({ menuOpen, onMenu }) {
  return (
    <header className={styles['admin-header']}>
      <Container className={styles['admin-header__inner']}>
        <button
          type="button"
          className={styles['admin-header__burger']}
          onClick={onMenu}
          aria-label="Разделы админки"
          aria-expanded={menuOpen}
        >
          <Icon name="burger" width={30} />
        </button>
        <Logo to="/admin" label="Yes — главная админки" />
        <Link to="/admin/settings" className={styles['admin-header__avatar']} aria-label="Администратор — настройки">
          <Icon name="avatar" width={34} />
        </Link>
      </Container>
    </header>
  );
}
