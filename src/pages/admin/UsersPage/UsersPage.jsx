import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage/AdminPage';
import AdminPageHead from '../../../components/admin/AdminPageHead/AdminPageHead';
import AdminNotice from '../../../components/admin/AdminNotice/AdminNotice';
import DataTable from '../../../components/admin/DataTable/DataTable';
import Pagination from '../../../components/admin/Pagination/Pagination';
import Button from '../../../components/Button/Button';
import SearchField from '../../../components/SearchField/SearchField';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { useAdmin } from '../../../store/AdminContext';
import { formatDate, formatNumber, formatPrice } from '../../../utils/format';
import usePaged from '../../../hooks/usePaged';
import styles from './UsersPage.module.css';

const PER_PAGE = 10;
const groups = {
  active: { title: 'Активные покупатели', crumb: 'Активные' },
  blacklist: { title: 'Черный список', crumb: 'Черный список' },
};
const normalize = (text) => text.toLowerCase().replace(/ё/g, 'е').trim();

// Пользователи → Активные / Черный список. Макета нет: покупатели собираются из заказов (по e-mail),
// чёрный список — пометка для менеджера, хранится в localStorage
export default function UsersPage() {
  const { group } = useParams();
  const { customers, setBlocked } = useAdmin();
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const config = groups[group];
  const blocked = group === 'blacklist';

  const list = useMemo(() => {
    const q = normalize(query);
    return customers.filter((c) => c.blocked === blocked && (!q || normalize(`${c.name} ${c.email} ${c.phone}`).includes(q)));
  }, [customers, blocked, query]);

  const { page, pages, setPage, items } = usePaged(list, PER_PAGE, `${group}|${query}`);

  if (!config) return <Navigate to="/admin/users/active" replace />;

  const toggle = (c) => {
    setBlocked(c.email, !blocked);
    setNotice(blocked ? `${c.name} убран(а) из чёрного списка` : `${c.name} в чёрном списке`);
  };

  const columns = [
    {
      key: 'name',
      title: 'Покупатель и контакты',
      rowHeader: true,
      className: styles['users-page__col-name'],
      render: (c) => (
        <>
          <span className={styles['users-page__name']}>{c.name}</span>
          <span className={styles['users-page__contact']}>{c.email}</span>
          <span className={styles['users-page__contact']}>{c.phone}</span>
        </>
      ),
    },
    {
      key: 'orders',
      title: 'Заказы',
      render: (c) => (
        <>
          {formatNumber(c.orders)}
          {c.active > 0 && <span className={styles['users-page__meta']}>в работе: {c.active}</span>}
          <span className={styles['users-page__meta']}>последний {formatDate(c.lastOrder)}</span>
        </>
      ),
    },
    { key: 'sum', title: 'Сумма покупок', render: (c) => <span className={styles['users-page__sum']}>{formatPrice(c.sum)}</span> },
    {
      key: 'action',
      title: 'Действие',
      hideLabel: true,
      className: styles['users-page__col-action'],
      render: (c) => (
        <Button variant="secondary" className={styles['users-page__action']} onClick={() => toggle(c)}>
          {blocked ? 'Вернуть' : 'В черный список'}
        </Button>
      ),
    },
  ];

  return (
    <AdminPage crumbs={[{ label: 'Пользователи' }, { label: config.crumb }]}>
      <AdminPageHead title={config.title} />
      <SearchField className={styles['users-page__search']} label="Поиск по имени, e-mail или телефону" value={query} onChange={setQuery} />
      <p className={styles['users-page__note']}>
        Покупатели собраны из заказов. Черный список — пометка для менеджеров, на витрину не влияет.
      </p>
      {notice && <AdminNotice onClose={() => setNotice('')}>{notice}</AdminNotice>}
      {items.length ? (
        <>
          <DataTable caption={`${config.title}, страница ${page} из ${pages}`} columns={columns} rows={items} rowKey={(c) => c.email} />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      ) : (
        <EmptyState icon="user" title={query ? 'Никого не найдено' : blocked ? 'Черный список пуст' : 'Покупателей нет'} />
      )}
    </AdminPage>
  );
}
