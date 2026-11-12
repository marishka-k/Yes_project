// Аналитика продаж: точки графика и итоги за период.
// Заказ попадает в день (месяц) оформления; возврат — в день оформления возвращённого заказа
import { orderGroups } from '../data/orders';
import { monthsShort } from '../data/adminNavigation';

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// period: { mode: 'month' | 'year', year, month (0–11) }; today — до какой даты строить (будущие дни не показываем)
export function salesReport(orders, { mode, year, month }, today = new Date()) {
  const isMonth = mode === 'month';
  const size = isMonth ? daysInMonth(year, month) : 12;
  let last = size;
  if (year === today.getFullYear() && (!isMonth || month === today.getMonth())) last = isMonth ? today.getDate() : today.getMonth() + 1;
  if (year > today.getFullYear() || (isMonth && year === today.getFullYear() && month > today.getMonth())) last = 0;

  const points = Array.from({ length: last }, (_, i) => ({
    label: isMonth ? String(i + 1) : monthsShort[i],
    orders: 0,
    returns: 0,
  }));
  const totals = { created: 0, done: 0, returned: 0, active: 0, cancelled: 0 };

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    if (date.getFullYear() !== year || (isMonth && date.getMonth() !== month)) return;
    const point = points[isMonth ? date.getDate() - 1 : date.getMonth()];
    if (!point) return;
    point.orders += 1;
    totals.created += 1;
    if (order.status === 'returned') {
      point.returns += 1;
      totals.returned += 1;
    } else if (order.status === 'done') totals.done += 1;
    else if (order.status === 'cancelled') totals.cancelled += 1;
    else if (orderGroups.active.statuses.includes(order.status)) totals.active += 1;
  });

  return { points, totals };
}
