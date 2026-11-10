// Промокоды, оплата и согласия на странице оформления (демо)
export const promoCodes = {
  SUMMER2025: { discount: 2000, minTotal: 5000 },
  YES10: { discount: 1000, minTotal: 3000 },
};

// Скидка при оплате картой онлайн — 5% на стоимость товаров
export const ONLINE_DISCOUNT = 0.05;

export const paymentMethods = [
  { id: 'card-online', label: 'Картой онлайн', hint: 'скидка 5% на стоимость товаров' },
  { id: 'card-courier', label: 'Картой при получении' },
  { id: 'cash', label: 'Наличными при получении' },
];

export const paymentSystems = [
  { id: 'mastercard', label: 'Mastercard', image: 'images/payment/mastercard.webp', width: 46, height: 28 },
  { id: 'visa', label: 'VISA', image: 'images/payment/visa.webp', width: 46, height: 28 },
  { id: 'mir', label: 'МИР', image: 'images/payment/mir.webp', width: 46, height: 28 },
  { id: 'sbp', label: 'СБП — система быстрых платежей', image: 'images/payment/sbp.webp', width: 74, height: 37 },
];

export const consents = [
  { id: 'personal', prefix: '', link: 'На обработку персональных данных' },
  { id: 'privacy', prefix: 'С ', link: 'Политикой конфиденциальности' },
  { id: 'terms', prefix: 'С ', link: 'Пользовательским соглашением' },
];
