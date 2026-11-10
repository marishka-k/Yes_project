// Меню шапки и подвала
export const mainNav = [
  { to: '/', label: 'Главная', end: true },
  { to: '/catalog', label: 'Каталог' },
  { to: '/delivery', label: 'Доставка' },
];

export const footerNav = [
  {
    title: 'Покупателям:',
    links: [
      { to: '/delivery', label: 'Доставка' },
      { to: '/info/return', label: 'Возврат' },
      { to: '/info/reviews', label: 'Отзывы о товарах' },
      { to: '/info/faq', label: 'Вопросы и ответы' },
    ],
  },
  {
    title: 'О компании:',
    links: [
      { to: '/info/about', label: 'О нас' },
      { to: '/info/feedback', label: 'Отзывы' },
      { to: '/info/career', label: 'Карьера' },
      { to: '/info/contacts', label: 'Контакты' },
    ],
  },
];

// Заголовки информационных страниц (наполнение — позже)
export const infoPages = {
  return: 'Возврат',
  reviews: 'Отзывы о товарах',
  faq: 'Вопросы и ответы',
  about: 'О нас',
  feedback: 'Отзывы',
  career: 'Карьера',
  contacts: 'Контакты',
  personal: 'Согласие на обработку персональных данных',
  privacy: 'Политика конфиденциальности',
  terms: 'Пользовательское соглашение',
};

export const socials = [
  { icon: 'vk', label: 'ВКонтакте', href: 'https://vk.com' },
  { icon: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
  { icon: 'telegram', label: 'Telegram', href: 'https://t.me' },
];
