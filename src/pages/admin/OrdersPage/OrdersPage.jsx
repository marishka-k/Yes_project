import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage/AdminPage';
import AdminPageHead from '../../../components/admin/AdminPageHead/AdminPageHead';
import DataTable from '../../../components/admin/DataTable/DataTable';
import Pagination from '../../../components/admin/Pagination/Pagination';
import StatusBadge from '../../../components/admin/StatusBadge/StatusBadge';
import Button from '../../../components/Button/Button';
import Chip from '../../../components/Chip/Chip';
import SearchField from '../../../components/SearchField/SearchField';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { useAdmin } from '../../../store/AdminContext';
import { orderGroups, orderStatuses } from '../../../data/orders';
import { formatDate, formatNumber, formatPrice, plural } from '../../../utils/format';
import usePaged from '../../../hooks/usePaged';
import styles from './OrdersPage.module.css';

const PER_PAGE = 10;
const normalize = (text) => text.toLowerCase().replace(/ё/g, 'е').trim();

// Заказы → В работе / Выполненные / Возвраты: строки-карточки как в макете списка заказов,
// фильтр по статусу внутри раздела, поиск по номеру, имени и e-mail, «Подробно» — карточка заказа
export default function OrdersPage() {
  const { group } = useParams();
  const { orders } = useAdmin();
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const config = orderGroups[group];

  // Другой раздел — фильтр по статусу сбрасывается
  useEffect(() => setStatus(''), [group]);

  const list = useMemo(() => {
    if (!config) return [];
    const q = normalize(query);
    return orders.filter((o) => {
      if (!config.statuses.includes(o.status) || (status && o.status !== status)) return false;
      if (!q) return true;
      const c = o.customer;
      return o.number.includes(q) || normalize(`${c.lastName} ${c.firstName} ${c.email}`).includes(q);
    });
  }, [orders, config, status, query]);

  const { page, pages, setPage, items } = usePaged(list, PER_PAGE, `${group}|${status}|${query}`);

  if (!config) return <Navigate to="/admin/orders/active" replace />;

  const columns = [
    {
      key: 'number',
      title: 'Номер заказа',
      rowHeader: true,
      className: styles['orders-page__col-number'],
      render: (o) => (
        <>
          <span className={styles['orders-page__number']}>{o.number}</span>
          <span className={styles['orders-page__date']}>{formatDate(o.createdAt)}</span>
        </>
      ),
    },
    { key: 'customer', title: 'Покупатель', render: (o) => `${o.customer.lastName} ${o.customer.firstName}` },
    { key: 'total', title: 'Сумма к оплате', className: styles['orders-page__col-sum'], render: (o) => <b>{formatPrice(o.totals.total)}</b> },
    { key: 'payment', title: 'Статус оплаты', render: (o) => <StatusBadge kind="payment" status={o.paymentStatus} /> },
    { key: 'status', title: 'Статус заказа', render: (o) => <StatusBadge status={o.status} /> },
    {
      key: 'more',
      title: 'Подробнее',
      hideLabel: true,
      className: styles['orders-page__col-more'],
      render: (o) => (
        <Button to={`/admin/order/${o.number}`} className={styles['orders-page__more']} aria-label={`Подробно о заказе ${o.number}`}>
          Подробно
        </Button>
      ),
    },
  ];

  return (
    <AdminPage crumbs={[{ label: 'Заказы' }, { label: config.crumb }]}>
      <AdminPageHead title={config.title} />

      <div className={styles['orders-page__filters']}>
        {config.statuses.length > 1 && (
          <ul className={styles['orders-page__chips']} aria-label="Статус заказа">
            <li>
              <Chip selected={!status} onClick={() => setStatus('')}>
                Все
              </Chip>
            </li>
            {config.statuses.map((s) => (
              <li key={s}>
                <Chip selected={status === s} onClick={() => setStatus(status === s ? '' : s)}>
                  {orderStatuses[s]}
                </Chip>
              </li>
            ))}
          </ul>
        )}
        <SearchField className={styles['orders-page__search']} label="Поиск по номеру, имени или e-mail" value={query} onChange={setQuery} />
      </div>

      <p className={styles['orders-page__count']} aria-live="polite">
        {formatNumber(list.length)} {plural(list.length, ['заказ', 'заказа', 'заказов'])}
      </p>

      {items.length ? (
        <>
          <DataTable caption={`${config.title}, страница ${page} из ${pages}`} columns={columns} rows={items} rowKey={(o) => o.number} />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      ) : (
        <EmptyState icon="search" title={query || status ? 'Ничего не найдено' : 'Заказов нет'} />
      )}
    </AdminPage>
  );
}
