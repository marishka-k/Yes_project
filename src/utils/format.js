// Цена с неразрывными пробелами: 10 000 ₽
export const formatNumber = (value) => Math.round(value).toLocaleString('ru-RU').replace(/\s/g, ' ');
export const formatPrice = (value) => `${formatNumber(value)} ₽`;

// Склонение: plural(5, ['отзыв', 'отзыва', 'отзывов'])
export function plural(n, forms) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

// Дата заказа: 10.11.2026
export const formatDate = (iso) => new Date(iso).toLocaleDateString('ru-RU');
