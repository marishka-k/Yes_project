// Боковое меню админки (макет Desktop analytics): группы и пункты
export const adminNav = [
  { title: 'Аналитика', links: [{ to: '/admin/analytics', label: 'График продаж' }] },
  {
    title: 'Каталог товаров',
    links: [
      { to: '/admin/products', label: 'Активные товары', end: true },
      { to: '/admin/products/archive', label: 'Товары в архиве' },
    ],
  },
  {
    title: 'Заказы',
    links: [
      { to: '/admin/orders/active', label: 'В работе' },
      { to: '/admin/orders/done', label: 'Выполненные' },
      { to: '/admin/orders/returns', label: 'Возвраты' },
    ],
  },
  {
    title: 'Пользователи',
    links: [
      { to: '/admin/users/active', label: 'Активные' },
      { to: '/admin/users/blacklist', label: 'Черный список' },
    ],
  },
  { title: 'Настройка', to: '/admin/settings' },
];

export const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
export const monthsShort = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
