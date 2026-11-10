// Товары витрины. Поля совпадают с формой «Добавить товар» из макета (этап 2):
// артикул, название, категория, сезон, коллекция, состав, подкладка, пол, цена, скидка, цвета, размеры.
// price — цена со скидкой, oldPrice — без скидки (если есть).
// images — файлы из public/images/products (карточка ~600 px); large: true — есть крупная версия «-l» (~1200 px)
// focus — какая часть фото видна в карточке (object-position)

const CLOTHES_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

let counter = 0;
const item = (data) => {
  counter += 1;
  return {
    season: 'Лето',
    collection: 'Весна-лето 2025',
    composition: 'Полиэфирное волокно',
    lining: 'Полиэфирное волокно',
    gender: ['women'],
    sizes: CLOTHES_SIZES,
    oldPrice: null,
    focus: 'center 20%',
    large: false,
    images: [`${data.id}.webp`],
    article: String(12345678900 + counter),
    rating: 4.7,
    reviews: 30,
    ...data,
  };
};

const NO_LINING = { lining: 'Без подкладки' };
const ACCESSORY = { sizes: [], ...NO_LINING };

export const products = [
  // Купальники
  item({
    id: 'swimsuit-white',
    name: 'Закрытый купальник',
    category: 'beachwear',
    colors: ['white', 'beige', 'brown'],
    price: 7000,
    oldPrice: 10000,
    images: ['swimsuit-white-1.webp', 'swimsuit-white-2.webp', 'swimsuit-white-3.webp', 'swimsuit-white-4.webp'],
    focus: 'center 10%',
    rating: 4.8,
    reviews: 189,
    popularity: 5,
    createdAt: '2026-04-02',
  }),
  item({ id: 'swimsuit-sleeve', name: 'Закрытый купальник', category: 'beachwear', colors: ['lightblue', 'multi'], price: 10000, focus: 'center 8%', rating: 4.9, reviews: 74, popularity: 6, createdAt: '2026-06-20' }),
  item({ id: 'bikini-mint', name: 'Открытый купальник', category: 'beachwear', colors: ['mint'], price: 10000, large: true, focus: 'center 28%', reviews: 52, popularity: 7, createdAt: '2026-06-18' }),
  item({ id: 'bikini-shirt', name: 'Открытый купальник', category: 'beachwear', colors: ['white'], price: 10000, large: true, focus: 'center 30%', rating: 4.6, reviews: 31, popularity: 9, createdAt: '2026-06-15' }),
  item({ id: 'swimsuit-ribbed', name: 'Закрытый купальник', category: 'beachwear', colors: ['white'], price: 10000, focus: 'center 25%', rating: 4.8, reviews: 96, popularity: 8, createdAt: '2026-06-10' }),
  item({ id: 'swimsuit-beige', name: 'Закрытый купальник', category: 'beachwear', colors: ['beige'], price: 10000, large: true, focus: 'center 30%', rating: 4.5, reviews: 40, popularity: 10, createdAt: '2026-05-12' }),
  item({ id: 'swimsuit-glass', name: 'Закрытый купальник', category: 'beachwear', colors: ['white'], price: 10000, focus: 'center 15%', rating: 4.6, reviews: 28, popularity: 11, createdAt: '2026-05-05' }),
  item({ id: 'swimsuit-black', name: 'Купальник спортивный', category: 'beachwear', colors: ['black'], price: 9000, oldPrice: 11000, focus: 'center 25%', rating: 4.7, reviews: 63, popularity: 16, createdAt: '2026-04-25' }),
  item({ id: 'swimsuit-lounge', name: 'Закрытый купальник', category: 'beachwear', colors: ['white'], price: 9500, large: true, focus: 'center 45%', rating: 4.5, reviews: 22, popularity: 17, createdAt: '2026-04-18' }),
  item({ id: 'swimsuit-grey', name: 'Купальник с открытой спиной', category: 'beachwear', colors: ['grey', 'blue'], price: 11000, large: true, focus: 'center 35%', rating: 4.9, reviews: 57, popularity: 18, createdAt: '2026-06-05' }),

  // Одежда
  item({ id: 'beach-suit', name: 'Пляжный костюм', category: 'clothes', colors: ['beige', 'white'], composition: 'Лён', ...NO_LINING, price: 10000, focus: 'center 25%', rating: 4.9, reviews: 211, popularity: 1, createdAt: '2026-03-15' }),
  item({ id: 'kimono-white', name: 'Платье-кимоно', category: 'clothes', colors: ['white'], composition: 'Вискоза', ...NO_LINING, price: 9000, focus: 'center 25%', rating: 4.8, reviews: 35, popularity: 12, createdAt: '2026-06-01' }),
  item({ id: 'suit-beige', name: 'Брючный костюм', category: 'clothes', colors: ['beige'], composition: 'Лён', ...NO_LINING, price: 12000, oldPrice: 14000, focus: 'center 35%', rating: 4.8, reviews: 26, popularity: 15, createdAt: '2026-05-30' }),
  item({ id: 'kimono', name: 'Кимоно пляжное', category: 'clothes', colors: ['mint'], composition: 'Вискоза', ...NO_LINING, price: 8000, focus: 'center 25%', reviews: 44, popularity: 13, createdAt: '2026-05-25' }),
  item({ id: 'shirt-grey', name: 'Рубашка оверсайз', category: 'clothes', colors: ['grey'], composition: 'Хлопок', ...NO_LINING, price: 5500, large: true, focus: 'center 20%', rating: 4.4, reviews: 19, popularity: 14, createdAt: '2026-04-10' }),
  item({ id: 'shirt-linen', name: 'Рубашка льняная', category: 'clothes', gender: ['women', 'men'], colors: ['white'], composition: 'Лён', ...NO_LINING, price: 6000, oldPrice: 7500, large: true, focus: 'center center', rating: 4.6, reviews: 37, popularity: 19, createdAt: '2026-04-20' }),

  // Обувь
  item({ id: 'slippers', name: 'Шлепанцы пляжные', category: 'shoes', colors: ['beige'], composition: 'Хлопковый шнур', ...NO_LINING, sizes: ['36', '37', '38', '39', '40'], price: 10000, focus: 'center 60%', reviews: 120, popularity: 3, createdAt: '2026-02-20' }),
  item({ id: 'flip-flops', name: 'Шлепанцы пляжные', category: 'shoes', colors: ['beige', 'white'], composition: 'Эко-кожа', ...NO_LINING, sizes: ['36', '37', '38', '39', '40'], price: 5000, focus: 'center center', rating: 4.5, reviews: 48, popularity: 20, createdAt: '2026-03-20' }),

  // Аксессуары
  item({ id: 'bag-wicker', name: 'Сумка плетеная', category: 'accessories', colors: ['beige'], composition: 'Джут', lining: 'Хлопок', sizes: [], price: 10000, focus: 'center center', rating: 4.8, reviews: 143, popularity: 2, createdAt: '2026-03-01' }),
  item({ id: 'towel', name: 'Полотенце пляжное', category: 'accessories', colors: ['yellow', 'white'], composition: 'Хлопок', ...ACCESSORY, price: 5000, focus: 'center center', rating: 4.9, reviews: 98, popularity: 4, createdAt: '2026-02-10' }),
  item({ id: 'towel-striped', name: 'Полотенце пляжное', category: 'accessories', colors: ['red', 'white'], composition: 'Хлопок', ...ACCESSORY, price: 3000, focus: 'center center', rating: 4.6, reviews: 41, popularity: 21, createdAt: '2026-03-05' }),
  item({ id: 'towel-beige', name: 'Пляжное полотенце', category: 'accessories', colors: ['beige', 'white'], composition: 'Хлопок', ...ACCESSORY, price: 4000, focus: 'center 40%', rating: 4.5, reviews: 17, popularity: 22, createdAt: '2026-05-15' }),
  item({ id: 'bag-beach', name: 'Сумка пляжная', category: 'accessories', colors: ['beige'], composition: 'Эко-кожа', ...ACCESSORY, price: 6000, focus: 'center center', rating: 4.7, reviews: 29, popularity: 23, createdAt: '2026-05-20' }),
  item({ id: 'shopper', name: 'Шоппер пляжный', category: 'accessories', colors: ['beige'], composition: 'Хлопок', ...ACCESSORY, price: 3500, focus: 'center center', rating: 4.6, reviews: 33, popularity: 24, createdAt: '2026-04-28' }),
  item({ id: 'shopper-net', name: 'Шоппер', category: 'accessories', colors: ['white'], composition: 'Хлопковый шнур', ...ACCESSORY, price: 3000, focus: 'center center', rating: 4.4, reviews: 12, popularity: 25, createdAt: '2026-04-12' }),
  item({ id: 'hat-straw', name: 'Шляпа соломенная', category: 'accessories', colors: ['beige'], composition: 'Солома', ...ACCESSORY, price: 4500, focus: 'center 70%', rating: 4.7, reviews: 26, popularity: 26, createdAt: '2026-06-08' }),
];

export const productById = Object.fromEntries(products.map((p) => [p.id, p]));
