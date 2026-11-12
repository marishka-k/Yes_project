// Форма товара в админке: товар ⇄ значения полей и проверка.
// В форме «Цена» — полная цена, «Скидка» — сумма скидки в рублях (макет: 10 000 и 3 000);
// в товаре price — цена со скидкой, oldPrice — без скидки
import { colors, sizes } from '../data/categories';
import { genderOptionOf, genderOptions, largeImages } from '../data/productOptions';
import { formatNumber } from './format';

export const emptyProductForm = (article = '') => ({
  article,
  name: '',
  category: '',
  season: '',
  collection: '',
  composition: '',
  lining: '',
  gender: '',
  price: '',
  discount: '',
  description: '',
  colors: [],
  sizes: [],
  images: [],
});

export const productToForm = (p) => ({
  article: p.article,
  name: p.name,
  category: p.category,
  season: p.season,
  collection: p.collection,
  composition: p.composition,
  lining: p.lining,
  gender: genderOptionOf(p.gender),
  price: formatNumber(p.oldPrice || p.price),
  discount: p.oldPrice ? formatNumber(p.oldPrice - p.price) : '',
  description: p.description || '',
  colors: [...p.colors],
  sizes: [...p.sizes],
  images: [...p.images],
});

export const parseMoney = (value) => Number(String(value).replace(/\D/g, '')) || 0;

// Следующий свободный артикул (11 цифр, как у товаров витрины)
export const nextArticle = (products) => String(Math.max(12345678900, ...products.map((p) => Number(p.article) || 0)) + 1);

// errors — { поле: текст }; пустой объект — форма в порядке
export function validateProduct(values, products, currentId) {
  const errors = {};
  const article = values.article.trim();
  if (!/^\d{6,13}$/.test(article)) errors.article = 'Артикул — от 6 до 13 цифр';
  else if (products.some((p) => p.article === article && p.id !== currentId)) errors.article = 'Такой артикул уже есть';
  if (values.name.trim().length < 3) errors.name = 'Введите название (не короче 3 символов)';
  ['category', 'season', 'collection', 'composition', 'lining', 'gender'].forEach((name) => {
    if (!values[name]) errors[name] = 'Выберите значение';
  });
  const price = parseMoney(values.price);
  const discount = parseMoney(values.discount);
  if (!price) errors.price = 'Укажите цену';
  else if (price > 1000000) errors.price = 'Не больше 1 000 000 ₽';
  if (discount && discount >= price) errors.discount = 'Скидка должна быть меньше цены';
  if (!values.colors.length) errors.colors = 'Отметьте хотя бы один цвет';
  if (!values.images.length) errors.images = 'Добавьте хотя бы одно фото';
  return errors;
}

// Значения формы → товар. base — исходный товар (рейтинг, отзывы, дата и т. п. сохраняются)
export function formToProduct(values, base) {
  const full = parseMoney(values.price);
  const discount = parseMoney(values.discount);
  const order = (list, selected) => list.map((x) => x.id).filter((id) => selected.includes(id));
  return {
    rating: 0,
    reviews: 0,
    popularity: 100,
    focus: 'center 20%',
    createdAt: new Date().toISOString().slice(0, 10),
    ...base,
    id: base?.id || `item-${Date.now().toString(36)}`,
    article: values.article.trim(),
    name: values.name.trim(),
    category: values.category,
    season: values.season,
    collection: values.collection,
    composition: values.composition,
    lining: values.lining,
    gender: genderOptions.find((o) => o.id === values.gender)?.value || ['women'],
    price: full - discount,
    oldPrice: discount ? full : null,
    description: values.description.trim(),
    colors: order(colors, values.colors),
    sizes: order(sizes, values.sizes),
    images: values.images,
    large: values.images.every((file) => largeImages.has(file)),
  };
}
