import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useStore } from './StoreContext';
import { getDemoOrders } from '../data/demoOrders';
import { orderGroups } from '../data/orders';

// Данные админки (только этот браузер):
// yes:admin:settings — настройки (показывать ли демо-заказы),
// yes:admin:demo-orders — изменённые статусы демо-заказов ({ [номер]: { status, paymentStatus } }),
// yes:admin:blacklist — e-mail покупателей в чёрном списке.
// Статусы настоящих заказов меняются прямо в yes:orders — их видит и личный кабинет
const AdminContext = createContext(null);

const defaultSettings = { demoOrders: true };

const customerName = (c) => [c.lastName, c.firstName, c.middleName].filter(Boolean).join(' ');

export function AdminProvider({ children }) {
  const { orders: ownOrders, updateOrder } = useStore();
  const [settings, setSettings] = useLocalStorage('yes:admin:settings', defaultSettings);
  const [demoPatches, setDemoPatches] = useLocalStorage('yes:admin:demo-orders', {});
  const [blacklist, setBlacklist] = useLocalStorage('yes:admin:blacklist', []);

  const options = useMemo(() => ({ ...defaultSettings, ...settings }), [settings]);

  const orders = useMemo(() => {
    const demo = options.demoOrders ? getDemoOrders().map((o) => (demoPatches[o.number] ? { ...o, ...demoPatches[o.number] } : o)) : [];
    return [...ownOrders, ...demo].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [ownOrders, demoPatches, options.demoOrders]);

  const orderByNumber = useMemo(() => Object.fromEntries(orders.map((o) => [o.number, o])), [orders]);

  const updateOrderStatus = useCallback(
    (number, patch) => {
      if (ownOrders.some((o) => o.number === number)) updateOrder(number, patch);
      else setDemoPatches((prev) => ({ ...prev, [number]: { ...prev[number], ...patch } }));
    },
    [ownOrders, updateOrder, setDemoPatches],
  );

  // Покупатели — из заказов, по e-mail
  const customers = useMemo(() => {
    const map = new Map();
    [...orders].reverse().forEach((o) => {
      const key = o.customer.email.toLowerCase();
      const entry = map.get(key) || { email: o.customer.email, orders: 0, sum: 0, active: 0 };
      entry.name = customerName(o.customer);
      entry.phone = o.customer.phone;
      entry.lastOrder = o.createdAt;
      entry.orders += 1;
      if (o.status !== 'cancelled' && o.status !== 'returned') entry.sum += o.totals.total;
      if (orderGroups.active.statuses.includes(o.status)) entry.active += 1;
      map.set(key, entry);
    });
    return [...map.values()]
      .map((c) => ({ ...c, blocked: blacklist.includes(c.email.toLowerCase()) }))
      .sort((a, b) => b.lastOrder.localeCompare(a.lastOrder));
  }, [orders, blacklist]);

  const setBlocked = useCallback(
    (email, value) => {
      const key = email.toLowerCase();
      setBlacklist((prev) => (value ? [...new Set([...prev, key])] : prev.filter((x) => x !== key)));
    },
    [setBlacklist],
  );

  const setOption = useCallback((name, value) => setSettings((prev) => ({ ...defaultSettings, ...prev, [name]: value })), [setSettings]);
  const resetDemoStatuses = useCallback(() => setDemoPatches({}), [setDemoPatches]);
  const clearBlacklist = useCallback(() => setBlacklist([]), [setBlacklist]);

  const value = useMemo(
    () => ({
      orders,
      orderByNumber,
      updateOrderStatus,
      customers,
      setBlocked,
      settings: options,
      setOption,
      resetDemoStatuses,
      clearBlacklist,
      changedDemoCount: Object.keys(demoPatches).length,
      blacklistCount: blacklist.length,
    }),
    [orders, orderByNumber, updateOrderStatus, customers, setBlocked, options, setOption, resetDemoStatuses, clearBlacklist, demoPatches, blacklist],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => useContext(AdminContext);
