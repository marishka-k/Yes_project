// Справочники формы «Добавить товар» (админка). Значения, добавленные кнопкой «+»,
// хранятся в localStorage и дописываются к этим спискам (см. store/CatalogContext)
import { products } from './products';

const unique = (values) => [...new Set(values)];

export const seasons = ['Лето', 'Демисезон', 'Зима', 'Всесезон'];

export const collections = unique(['Весна-лето 2025', 'Осень-зима 2025', 'Весна-лето 2026', ...products.map((p) => p.collection)]);

export const compositions = unique(products.map((p) => p.composition));

export const linings = unique(['Без подкладки', ...products.map((p) => p.lining)]);

// Пол в форме — один пункт выпадающего списка, в товаре — массив (фильтр «Пол» в каталоге)
export const genderOptions = [
  { id: 'women', name: 'Женский', value: ['women'] },
  { id: 'men', name: 'Мужской', value: ['men'] },
  { id: 'unisex', name: 'Унисекс', value: ['women', 'men'] },
  { id: 'girls', name: 'Для девочек', value: ['girls'] },
  { id: 'boys', name: 'Для мальчиков', value: ['boys'] },
];

export const genderOptionOf = (gender = []) =>
  genderOptions.find((o) => o.value.length === gender.length && o.value.every((g) => gender.includes(g)))?.id || '';

// Все фото проекта — для выбора изображений товара (загрузки файлов нет: сайт статический)
export const productImages = unique(products.flatMap((p) => p.images));

// Файлы, у которых есть крупная версия «-l» (для галереи на странице товара)
export const largeImages = new Set(products.filter((p) => p.large).flatMap((p) => p.images));
