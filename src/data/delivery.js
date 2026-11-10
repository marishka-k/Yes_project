// Способы доставки и точки на картах (демо, координаты точек — проценты от картинки карты)
export const deliveryMethods = [
  { id: 'post', label: 'Доставка Почтой России', term: '10-14 дней', price: 1000 },
  { id: 'sdek', label: 'Доставка СДЭК', term: '3-7 дней', price: 2000 },
  { id: 'courier', label: 'Доставка Курьером', term: '3-7 дней', price: 3000 },
];

export const deliveryMethodById = Object.fromEntries(deliveryMethods.map((m) => [m.id, m]));

// Окна выбора на карте: заголовок, картинка карты и точки.
// fill — какие поля формы заполняются при выборе точки
export const deliveryMaps = {
  sdek: {
    title: 'Выбор пункта выдачи СДЭК',
    image: 'images/maps/sdek.webp',
    listTitle: 'Пункты выдачи',
    points: [
      { id: 's1', title: 'Пункт выдачи', address: 'ул. Первомайская, 3', hours: 'Пн-Пт 10:00-20:00, Сб 10:00-17:00', x: 52, y: 50, fill: { country: 'Россия', city: 'Москва', address: 'ул. Первомайская, 3' } },
      { id: 's2', title: 'Пункт выдачи', address: 'ул. Дыбенко, 11', hours: 'Пн-Пт 10:00-20:00, Сб 10:00-18:00', x: 44, y: 16, fill: { country: 'Россия', city: 'Москва', address: 'ул. Дыбенко, 11' } },
      { id: 's3', title: 'Пункт выдачи', address: 'мкр. Новое Внуково, 10', hours: 'Пн-Пт 10:00-20:00, Сб 10:00-18:00', x: 30, y: 80, fill: { country: 'Россия', city: 'Москва', address: 'мкр. Новое Внуково, 10' } },
      { id: 's4', title: 'Пункт выдачи', address: 'пр-т Ленина, 3', hours: 'Пн-Пт 10:00-20:00, Сб 10:00-18:00', x: 80, y: 62, fill: { country: 'Россия', city: 'Москва', address: 'пр-т Ленина, 3' } },
      { id: 's5', title: 'Пункт выдачи', address: 'ул. Объединения, 9/25', hours: 'Пн-Пт 10:00-20:00, Сб 10:00-16:00', x: 66, y: 36, fill: { country: 'Россия', city: 'Москва', address: 'ул. Объединения, 9/25' } },
    ],
  },
  post: {
    title: 'Выбор адреса доставки «Почта России»',
    image: 'images/maps/post.webp',
    listTitle: 'Отделения почты',
    points: [
      { id: 'p1', title: 'Отделение 101000', address: 'ул. Мясницкая, 26', hours: 'Пн-Пт 08:00-20:00', x: 47, y: 46, fill: { index: '101000', city: 'Москва', street: 'ул. Мясницкая', house: '26' } },
      { id: 'p2', title: 'Отделение 115280', address: 'ул. Ленинская Слобода, 19', hours: 'Пн-Пт 08:00-20:00', x: 52, y: 66, fill: { index: '115280', city: 'Москва', street: 'ул. Ленинская Слобода', house: '19' } },
      { id: 'p3', title: 'Отделение 125009', address: 'ул. Тверская, 7', hours: 'Пн-Сб 08:00-22:00', x: 40, y: 30, fill: { index: '125009', city: 'Москва', street: 'ул. Тверская', house: '7' } },
      { id: 'p4', title: 'Отделение 111024', address: 'ш. Энтузиастов, 31', hours: 'Пн-Пт 09:00-19:00', x: 66, y: 44, fill: { index: '111024', city: 'Москва', street: 'ш. Энтузиастов', house: '31' } },
    ],
  },
  courier: {
    title: 'Выбор адреса доставки курьером',
    image: 'images/maps/courier.webp',
    listTitle: 'Адреса на карте',
    points: [
      { id: 'c1', title: 'Нагатинская наб.', address: 'Нагатинская наб., 12', hours: '', x: 46, y: 40, fill: { city: 'Москва', street: 'Нагатинская наб.', house: '12' } },
      { id: 'c2', title: 'Коломенский пр.', address: 'Коломенский пр., 8', hours: '', x: 50, y: 74, fill: { city: 'Москва', street: 'Коломенский пр.', house: '8' } },
      { id: 'c3', title: 'Варшавское ш.', address: 'Варшавское ш., 41', hours: '', x: 39, y: 52, fill: { city: 'Москва', street: 'Варшавское ш.', house: '41' } },
      { id: 'c4', title: 'Нахимовский пр.', address: 'Нахимовский пр., 24', hours: '', x: 26, y: 70, fill: { city: 'Москва', street: 'Нахимовский пр.', house: '24' } },
    ],
  },
};

// Поля адреса для каждого способа (как в макете Delivery).
// span: half — половина строки, third — треть, wide — поле рядом с кнопкой «Выбрать на карте», full — вся строка
export const addressFields = {
  sdek: [
    { name: 'country', placeholder: 'Страна', label: 'Страна', span: 'half', required: true },
    { name: 'city', placeholder: 'Город', label: 'Город', span: 'half', required: true },
    { name: 'address', placeholder: 'Адрес доставки', label: 'Адрес пункта выдачи', span: 'wide', required: true },
  ],
  post: [
    { name: 'index', placeholder: 'Почтовый индекс', label: 'Почтовый индекс', span: 'half', required: true, inputMode: 'numeric' },
    { name: 'city', placeholder: 'Город', label: 'Город', span: 'half', required: true },
    { name: 'street', placeholder: 'Улица', label: 'Улица', span: 'third', required: true },
    { name: 'house', placeholder: 'Номер дома', label: 'Номер дома', span: 'third', required: true },
    { name: 'building', placeholder: 'корпус', label: 'Корпус', span: 'third' },
    { name: 'flat', placeholder: 'квартира', label: 'Квартира', span: 'wide' },
  ],
  courier: [
    { name: 'city', placeholder: 'Город', label: 'Город', span: 'half', required: true },
    { name: 'street', placeholder: 'Улица', label: 'Улица', span: 'half', required: true },
    { name: 'house', placeholder: 'Номер дома', label: 'Номер дома', span: 'small', required: true },
    { name: 'building', placeholder: 'корпус', label: 'Корпус', span: 'small' },
    { name: 'flat', placeholder: 'квартира', label: 'Квартира', span: 'small' },
    { name: 'comment', placeholder: 'Комментарий курьеру (не обязательно)', label: 'Комментарий курьеру', span: 'after' },
  ],
};

// Информация для страницы «Доставка»
export const deliveryInfo = [
  { id: 'post', title: 'Почта России', text: 'Доставка в любое отделение страны за 10-14 дней.', price: 'от 1 000 ₽' },
  { id: 'sdek', title: 'СДЭК', text: 'Пункты выдачи в большинстве городов, срок 3-7 дней.', price: 'от 2 000 ₽' },
  { id: 'courier', title: 'Курьер', text: 'Привезём до двери за 3-7 дней.', price: 'от 3 000 ₽' },
];
