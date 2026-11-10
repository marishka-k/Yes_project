import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

// Хлебные крошки: items — [{ label, to }], последний пункт — текущая страница
export default function Breadcrumbs({ items }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
      <ol className={styles.breadcrumbs__list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className={styles.breadcrumbs__item}>
              {isLast || !item.to ? (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              ) : (
                <Link className={styles.breadcrumbs__link} to={item.to}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
