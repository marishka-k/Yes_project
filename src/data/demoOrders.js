// Демо-заказы для админки: чтобы график продаж и списки не были пустыми.
// Генерируются детерминированно: заказы каждого дня зависят только от даты и SEED,
// поэтому при каждом открытии получаются одни и те же номера, клиенты и суммы.
// Хранятся только в памяти; в localStorage пишутся лишь изменённые в админке статусы
import { products } from './products';
import { deliveryMethods } from './delivery';
import { orderTotals } from '../utils/order';

const SEED = 20250101;
export const DEMO_START = '2025-01-01';

// Генератор псевдослучайных чисел mulberry32: одно и то же зерно — одна и та же последовательность
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rnd, list) => list[Math.floor(rnd() * list.length)];

export const demoCustomers = [
  ['Анна', 'Смирнова', 'Сергеевна', 'anna.smirnova@example.com', 'Москва'],
  ['Мария', 'Иванова', 'Андреевна', 'maria.ivanova@example.com', 'Санкт-Петербург'],
  ['Екатерина', 'Кузнецова', '', 'ekaterina.k@example.com', 'Казань'],
  ['Ольга', 'Попова', 'Игоревна', 'olga.popova@example.com', 'Москва'],
  ['Дарья', 'Соколова', '', 'dasha.sokolova@example.com', 'Сочи'],
  ['Алина', 'Лебедева', 'Олеговна', 'alina.lebedeva@example.com', 'Краснодар'],
  ['Ксения', 'Козлова', '', 'ksenia.kozlova@example.com', 'Екатеринбург'],
  ['Полина', 'Новикова', 'Дмитриевна', 'polina.novikova@example.com', 'Москва'],
  ['Виктория', 'Морозова', '', 'vika.morozova@example.com', 'Новосибирск'],
  ['Елена', 'Петрова', 'Викторовна', 'elena.petrova@example.com', 'Санкт-Петербург'],
  ['Юлия', 'Волкова', '', 'julia.volkova@example.com', 'Нижний Новгород'],
  ['Наталья', 'Соловьёва', 'Павловна', 'natalia.s@example.com', 'Самара'],
  ['Татьяна', 'Васильева', '', 'tanya.vasilieva@example.com', 'Москва'],
  ['Софья', 'Зайцева', 'Алексеевна', 'sofia.zaitseva@example.com', 'Калининград'],
  ['Ирина', 'Павлова', '', 'irina.pavlova@example.com', 'Ростов-на-Дону'],
  ['Алексей', 'Семёнов', 'Петрович', 'alexey.semenov@example.com', 'Москва'],
  ['Дмитрий', 'Голубев', '', 'dmitry.golubev@example.com', 'Воронеж'],
  ['Светлана', 'Виноградова', 'Юрьевна', 'svetlana.v@example.com', 'Сочи'],
  ['Валерия', 'Богданова', '', 'valeria.b@example.com', 'Уфа'],
  ['Кристина', 'Воробьёва', 'Олеговна', 'kristina.v@example.com', 'Москва'],
  ['Максим', 'Фёдоров', '', 'maxim.fedorov@example.com', 'Пермь'],
  ['Вероника', 'Михайлова', 'Ильинична', 'veronika.m@example.com', 'Санкт-Петербург'],
  ['Арина', 'Беляева', '', 'arina.belyaeva@example.com', 'Тюмень'],
  ['Евгения', 'Тарасова', 'Сергеевна', 'evgenia.t@example.com', 'Краснодар'],
].map(([firstName, lastName, middleName, email, city], index) => ({
  firstName,
  lastName,
  middleName,
  email,
  city,
  phone: `+7 9${String(10 + index).padStart(2, '0')} ${String(100 + index * 37).slice(-3)}-${String(10 + index * 3).slice(-2)}-${String(40 + index).slice(-2)}`,
}));

const streets = ['ул. Ленина', 'ул. Садовая', 'пр-т Мира', 'ул. Морская', 'ул. Пушкина', 'Набережная ул.', 'ул. Гагарина'];

// Сезонность: летом заказов больше
const SEASON = [0.8, 0.8, 0.9, 1, 1.2, 1.5, 1.6, 1.5, 1.1, 0.9, 0.8, 1];

const dateKey = (date) => date.toISOString().slice(0, 10);
const hashDate = (key) => key.split('').reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0, SEED);

// Статус по возрасту заказа в днях: свежие — в работе, старые — получены (редко — возврат или отмена)
function statusFor(rnd, age) {
  const roll = rnd();
  const lag = Math.floor(rnd() * 4);
  if (roll < 0.01 && age > 0) return 'cancelled';
  if (age <= 1 + lag / 2) return 'created';
  if (age <= 3 + lag) return 'shipped';
  if (age <= 6 + lag) return 'transit';
  if (age <= 9 + lag) return 'pickup';
  return roll > 0.98 ? 'returned' : 'done';
}

function makeOrder(rnd, day, index, age) {
  const customer = pick(rnd, demoCustomers);
  const count = rnd() < 0.6 ? 1 : rnd() < 0.7 ? 2 : 3;
  const lines = Array.from({ length: count }, () => {
    const product = pick(rnd, products);
    return {
      id: product.id,
      size: product.sizes.length ? pick(rnd, product.sizes) : '',
      color: pick(rnd, product.colors),
      qty: rnd() < 0.9 ? 1 : 2,
      product,
    };
  });
  const delivery = pick(rnd, deliveryMethods).id;
  const roll = rnd();
  const payment = roll < 0.55 ? 'card-online' : roll < 0.8 ? 'card-courier' : 'cash';
  const promo = rnd() < 0.15 ? 'SUMMER2025' : '';
  const status = statusFor(rnd, age);
  const created = new Date(`${day}T00:00:00`);
  created.setHours(8 + Math.floor(rnd() * 14), Math.floor(rnd() * 60));
  const street = pick(rnd, streets);
  const house = String(1 + Math.floor(rnd() * 60));

  return {
    number: `${day.slice(2).replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
    createdAt: created.toISOString(),
    demo: true,
    customer: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      middleName: customer.middleName,
      phone: customer.phone,
      email: customer.email,
    },
    delivery:
      delivery === 'sdek'
        ? { method: delivery, country: 'Россия', city: customer.city, address: `${street}, ${house}` }
        : { method: delivery, city: customer.city, street, house, ...(delivery === 'post' ? { index: String(100000 + Math.floor(rnd() * 800000)) } : {}) },
    payment,
    paymentStatus: payment === 'card-online' || status === 'done' || status === 'returned' ? 'paid' : 'unpaid',
    status,
    promo,
    items: lines.map((l) => ({ id: l.id, name: l.product.name, size: l.size, color: l.color, qty: l.qty, price: l.product.price })),
    totals: orderTotals(lines, { promo, delivery, payment }),
  };
}

// Заказы одного дня (от 2 до ~50, как на графике в макете)
function ordersOfDay(day, age) {
  const rnd = mulberry32(hashDate(day));
  const month = Number(day.slice(5, 7)) - 1;
  const count = Math.max(2, Math.round(26 * SEASON[month] * (0.25 + 1.75 * rnd() ** 1.6)));
  return Array.from({ length: count }, (_, i) => makeOrder(rnd, day, i, age));
}

// Все демо-заказы с DEMO_START по сегодняшний день, новые сверху.
// Кэш по дате: за один день генерация выполняется один раз
let cache = { day: '', list: [] };

export function getDemoOrders(today = new Date()) {
  const todayKey = dateKey(new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())));
  if (cache.day === todayKey) return cache.list;
  const list = [];
  const end = new Date(`${todayKey}T00:00:00Z`);
  for (let d = new Date(`${DEMO_START}T00:00:00Z`); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const day = dateKey(d);
    list.push(...ordersOfDay(day, Math.round((end - d) / 86400000)));
  }
  list.reverse();
  cache = { day: todayKey, list };
  return list;
}
