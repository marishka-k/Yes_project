import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { lineKey } from '../utils/order';

// Общее состояние сайта, хранится в localStorage:
// cart — [{ key, id, size, color, qty }], favorites — [id], history — [id] (последние просмотренные),
// promo — применённый промокод, orders — оформленные заказы (новые сверху).
// orders — заказы покупателя: их видят «Заказы» в профиле и админка (вместе с демо-заказами)
const StoreContext = createContext(null);

const HISTORY_LIMIT = 8;

export function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage('yes:cart', []);
  const [favorites, setFavorites] = useLocalStorage('yes:favorites', []);
  const [history, setHistory] = useLocalStorage('yes:history', []);
  const [promo, setPromo] = useLocalStorage('yes:promo', '');
  const [orders, setOrders] = useLocalStorage('yes:orders', []);

  const addToCart = useCallback(
    ({ id, size = '', color = '', qty = 1 }) => {
      const key = lineKey(id, size, color);
      setCart((prev) => {
        if (prev.some((line) => line.key === key)) {
          return prev.map((line) => (line.key === key ? { ...line, qty: line.qty + qty } : line));
        }
        return [...prev, { key, id, size, color, qty }];
      });
    },
    [setCart],
  );

  const setQty = useCallback(
    (key, qty) =>
      setCart((prev) =>
        qty <= 0 ? prev.filter((line) => line.key !== key) : prev.map((line) => (line.key === key ? { ...line, qty } : line)),
      ),
    [setCart],
  );

  const removeLine = useCallback((key) => setCart((prev) => prev.filter((line) => line.key !== key)), [setCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setPromo('');
  }, [setCart, setPromo]);

  const qtyInCart = useCallback((id) => cart.filter((l) => l.id === id).reduce((sum, l) => sum + l.qty, 0), [cart]);

  const toggleFavorite = useCallback(
    (id) => setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setFavorites],
  );

  const addToHistory = useCallback(
    (id) => setHistory((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, HISTORY_LIMIT)),
    [setHistory],
  );

  const addOrder = useCallback((order) => setOrders((prev) => [order, ...prev]), [setOrders]);

  // Смена статуса в админке: patch — { status } и/или { paymentStatus }
  const updateOrder = useCallback(
    (number, patch) => setOrders((prev) => prev.map((o) => (o.number === number ? { ...o, ...patch } : o))),
    [setOrders],
  );

  const value = useMemo(
    () => ({
      cart,
      favorites,
      history,
      promo,
      orders,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      qtyInCart,
      toggleFavorite,
      addToHistory,
      setPromo,
      addOrder,
      updateOrder,
    }),
    [cart, favorites, history, promo, orders, addToCart, setQty, removeLine, clearCart, qtyInCart, toggleFavorite, addToHistory, setPromo, addOrder, updateOrder],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
