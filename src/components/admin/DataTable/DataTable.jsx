import { cx } from '../../../utils/cx';
import styles from './DataTable.module.css';

// Таблица админки: на лаптопе и десктопе строки — карточки с рамкой (макеты списков товаров и заказов),
// до 1023 px каждая строка — карточка «подпись: значение» без горизонтальной прокрутки.
// columns — [{ key, title, render(row), className, rowHeader, hideLabel }]:
// rowHeader — ячейка-заголовок строки (th scope="row"), hideLabel — без подписи на мобильной
// и без видимого заголовка колонки (только для читалок),
// className — класс из модуля страницы (ширина, выравнивание)
export default function DataTable({ caption, columns, rows, rowKey, headHidden = false, className }) {
  return (
    <table className={cx(styles['data-table'], className)}>
      <caption className="visually-hidden">{caption}</caption>
      <thead className={cx(styles['data-table__head'], headHidden && 'visually-hidden')}>
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col" className={cx(styles['data-table__th'], col.className)}>
              {col.hideLabel ? <span className="visually-hidden">{col.title}</span> : col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={rowKey(row)} className={styles['data-table__row']}>
            {columns.map((col) => {
              const Tag = col.rowHeader ? 'th' : 'td';
              return (
                <Tag
                  key={col.key}
                  scope={col.rowHeader ? 'row' : undefined}
                  className={cx(styles['data-table__cell'], col.hideLabel && styles['data-table__cell_no-label'], col.className)}
                  data-label={col.title}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </Tag>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
