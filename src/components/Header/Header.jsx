import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Container from '../Container/Container';
import Logo from '../Logo/Logo';
import Icon from '../Icon/Icon';
import SearchField from '../SearchField/SearchField';
import Drawer from '../Drawer/Drawer';
import { useStore } from '../../store/StoreContext';
import { mainNav } from '../../data/navigation';
import { cx } from '../../utils/cx';
import styles from './Header.module.css';

const navClass = ({ isActive }) => cx(styles.header__link, isActive && styles.header__link_active);
const iconClass = ({ isActive }) => cx(styles.header__icon, isActive && styles.header__icon_active);

// Шапка: на десктопе — меню, поиск и иконки в одну строку (как в макете);
// до 1023 px — бургер с выезжающим меню, поиск отдельной строкой
export default function Header() {
  const { cart, favorites } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const count = cart.reduce((sum, line) => sum + line.qty, 0);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className={styles.header}>
      <Container className={styles.header__inner}>
        <button
          type="button"
          className={styles.header__burger}
          onClick={() => setMenuOpen(true)}
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
        >
          <Icon name="burger" width={30} />
        </button>

        <Logo />

        <nav className={styles.header__nav} aria-label="Основное меню">
          <ul className={styles.header__list}>
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <SearchField className={styles.header__search} />

        <ul className={styles.header__icons}>
          <li>
            <NavLink to="/favorites" className={iconClass} aria-label={`Избранное, товаров: ${favorites.length}`}>
              <Icon name="heart" width={32} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className={iconClass} aria-label={`Корзина, товаров: ${count}`}>
              <Icon name="cart" width={32} />
              {count > 0 && (
                <span className={styles.header__badge} aria-hidden="true">
                  {count > 99 ? '99' : count}
                </span>
              )}
            </NavLink>
          </li>
          <li className={styles.header__profile}>
            <NavLink to="/profile" className={iconClass} aria-label="Личный кабинет">
              <Icon name="user" width={32} />
            </NavLink>
          </li>
        </ul>
      </Container>

      <Container className={styles['header__mobile-search']}>
        <SearchField />
      </Container>

      <Drawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} title="Меню">
        <nav aria-label="Мобильное меню">
          <ul className={styles['header__drawer-list']}>
            {[...mainNav, { to: '/favorites', label: 'Избранное' }, { to: '/cart', label: 'Корзина' }, { to: '/profile', label: 'Личный кабинет' }].map(
              (item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={navClass}>
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>
      </Drawer>
    </header>
  );
}
