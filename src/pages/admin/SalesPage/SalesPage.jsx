import { useMemo, useState } from 'react';
import AdminPage from '../../../components/admin/AdminPage/AdminPage';
import SalesChart from '../../../components/admin/SalesChart/SalesChart';
import StatTile from '../../../components/admin/StatTile/StatTile';
import PageTitle from '../../../components/PageTitle/PageTitle';
import Select from '../../../components/Select/Select';
import { useAdmin } from '../../../store/AdminContext';
import { months } from '../../../data/adminNavigation';
import { DEMO_START } from '../../../data/demoOrders';
import { salesReport } from '../../../utils/analytics';
import { formatNumber } from '../../../utils/format';
import styles from './SalesPage.module.css';

const periodOptions = [
  { id: 'month', name: 'Месяц' },
  { id: 'year', name: 'Год' },
];
const monthOptions = months.map((name, i) => ({ id: String(i), name }));

// Аналитика → График продаж: период (месяц или год), график заказов и возвратов, итоги за период.
// Данные — заказы покупателей из localStorage и демо-заказы; смена статуса заказа сразу меняет итоги
export default function SalesPage() {
  const { orders } = useAdmin();
  const today = new Date();
  const [mode, setMode] = useState('month');
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const yearOptions = useMemo(() => {
    const first = Math.min(Number(DEMO_START.slice(0, 4)), ...orders.map((o) => new Date(o.createdAt).getFullYear()));
    return Array.from({ length: today.getFullYear() - first + 1 }, (_, i) => ({ id: String(first + i), name: String(first + i) }));
  }, [orders, today.getFullYear()]);

  const { points, totals } = useMemo(() => salesReport(orders, { mode, year, month }), [orders, mode, year, month]);
  const periodName = mode === 'month' ? `${months[month].toLowerCase()} ${year}` : `${year} год`;

  const stats = [
    ['Оформлено', totals.created],
    ['Выполнено', totals.done],
    ['Возвращено', totals.returned],
    ['В работе', totals.active],
    ['Отменено', totals.cancelled],
  ];

  return (
    <AdminPage crumbs={[{ label: 'Аналитика', to: '/admin/analytics' }, { label: 'График продаж' }]}>
      <PageTitle className={styles['sales-page__title']}>График продаж</PageTitle>

      <div className={styles['sales-page__controls']}>
        <Select className={styles['sales-page__select']} label="Период" options={periodOptions} value={mode} onChange={setMode} />
        {mode === 'month' && (
          <Select
            className={styles['sales-page__select']}
            label="Месяц"
            options={monthOptions}
            value={String(month)}
            onChange={(v) => setMonth(Number(v))}
          />
        )}
        <Select
          className={styles['sales-page__select_size_s']}
          label="Год"
          options={yearOptions}
          value={String(year)}
          onChange={(v) => setYear(Number(v))}
        />
      </div>

      <SalesChart points={points} unit={mode === 'month' ? 'День' : 'Месяц'} title={`Заказы и возвраты: ${periodName}`} />

      <h2 className="visually-hidden">Итоги за {periodName}</h2>
      <dl className={styles['sales-page__stats']}>
        {stats.map(([label, value]) => (
          <StatTile key={label} label={label} value={formatNumber(value)} />
        ))}
      </dl>
    </AdminPage>
  );
}
