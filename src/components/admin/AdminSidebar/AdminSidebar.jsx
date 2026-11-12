import { NavLink } from 'react-router-dom';
import { adminNav } from '../../../data/adminNavigation';
import { cx } from '../../../utils/cx';
import styles from './AdminSidebar.module.css';

const linkClass =
  (base) =>
  ({ isActive }) =>
    cx(styles[base], isActive && styles[`${base}_active`]);

// Меню разделов админки: группы (Аналитика, Каталог товаров …) и пункты.
// variant: box — рамка слева от страницы (макет), drawer — внутри выезжающей панели
export default function AdminSidebar({ variant = 'box', className }) {
  return (
    <nav className={cx(styles['admin-sidebar'], styles[`admin-sidebar_variant_${variant}`], className)} aria-label="Разделы админки">
      <ul className={styles['admin-sidebar__groups']}>
        {adminNav.map((group) => (
          <li key={group.title}>
            {group.to ? (
              <NavLink to={group.to} className={linkClass('admin-sidebar__title')}>
                {group.title}
              </NavLink>
            ) : (
              <>
                <span className={styles['admin-sidebar__title']}>{group.title}</span>
                <ul className={styles['admin-sidebar__links']}>
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <NavLink to={link.to} end={link.end} className={linkClass('admin-sidebar__link')}>
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
