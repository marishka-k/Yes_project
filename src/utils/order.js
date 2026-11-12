import { ONLINE_DISCOUNT, promoCodes } from '../data/checkout';
import { deliveryMethodById } from '../data/delivery';

// Ключ позиции корзины: один товар в разных размерах и цветах — разные позиции
export const lineKey = (id, size, color) => [id, size || '-', color || '-'].join('|');

// Позиции корзины с данными товаров (товары, которых нет на витрине или они в архиве, пропускаются).
// productById — актуальный каталог из CatalogContext (базовые товары + правки админки)
export const cartLines = (cart, productById) =>
  cart.filter((line) => productById[line.id]).map((line) => ({ ...line, product: productById[line.id] }));

export const itemsCount = (lines) => lines.reduce((sum, line) => sum + line.qty, 0);

// Стоимость без скидок, скидка по товарам и сумма к оплате за товары
export function goodsTotals(lines) {
  const full = lines.reduce((sum, l) => sum + (l.product.oldPrice || l.product.price) * l.qty, 0);
  const goods = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  return { full, discount: full - goods, goods };
}

// Проверка промокода: { ok, discount, message }
export function checkPromo(code, goods) {
  const promo = code && promoCodes[code.trim().toUpperCase()];
  if (!promo) return { ok: false, discount: 0, message: 'Промокод не найден' };
  if (goods < promo.minTotal) {
    return { ok: false, discount: 0, message: `Действует при заказе от ${promo.minTotal.toLocaleString('ru-RU')} ₽` };
  }
  return { ok: true, discount: Math.min(promo.discount, goods), message: 'Промокод применён' };
}

// Итог заказа: товары со скидкой + доставка − промокод − 5% за оплату онлайн
export function orderTotals(lines, { promo, delivery, payment } = {}) {
  const { full, discount, goods } = goodsTotals(lines);
  const promoValue = promo ? checkPromo(promo, goods).discount : 0;
  const deliveryPrice = delivery ? deliveryMethodById[delivery]?.price || 0 : 0;
  const online = payment === 'card-online' ? Math.round(goods * ONLINE_DISCOUNT) : 0;
  const total = Math.max(goods - promoValue - online, 0) + deliveryPrice;
  return { full, discount, goods, promoValue, deliveryPrice, online, total };
}

// Номер заказа для демо-окна «Спасибо!»
export const makeOrderNumber = () => String(Date.now()).slice(-8);
