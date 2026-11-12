import Icon from '../../Icon/Icon';
import { cx } from '../../../utils/cx';
import styles from './Pagination.module.css';

// Номера страниц: первые и последние, текущая с соседями, пропуски — «…» (макет: 1 2 … 49 50)
function pageItems(page, pages) {
  const set = new Set([1, 2, page - 1, page, page + 1, pages - 1, pages].filter((n) => n >= 1 && n <= pages));
  const list = [...set].sort((a, b) => a - b);
  return list.flatMap((n, i) => (i > 0 && n - list[i - 1] > 1 ? ['gap' + n, n] : [n]));
}

// Переключатель страниц из макета: треугольники «назад/вперёд», номера в рамках, текущая — акцентом
export default function Pagination({ page, pages, onChange, label = 'Страницы списка' }) {
  if (pages <= 1) return null;
  return (
    <nav className={styles.pagination} aria-label={label}>
      <button
        type="button"
        className={cx(styles.pagination__arrow, styles.pagination__arrow_prev)}
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Предыдущая страница"
      >
        <Icon name="arrow" width={15} />
      </button>
      <ul className={styles.pagination__list}>
        {pageItems(page, pages).map((item) =>
          typeof item === 'string' ? (
            <li key={item} className={styles.pagination__gap} aria-hidden="true">
              •••
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={cx(styles.pagination__page, item === page && styles.pagination__page_current)}
                onClick={() => onChange(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Страница ${item}`}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>
      <button
        type="button"
        className={cx(styles.pagination__arrow, styles.pagination__arrow_next)}
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        aria-label="Следующая страница"
      >
        <Icon name="arrow" width={15} />
      </button>
    </nav>
  );
}
