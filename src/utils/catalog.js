// Фильтры каталога живут в адресной строке (?category=beachwear&color=white&sort=new),
// поэтому ссылки «Показать еще», поиск из шапки и кнопка «назад» работают без лишнего состояния
import { products } from '../data/products';

export const LIST_KEYS = ['category', 'gender', 'size', 'color'];

// Границы цены для ползунка: от 0 до ближайшей тысячи выше самой дорогой позиции
export const PRICE_MIN = 0;
export const PRICE_MAX = Math.ceil(Math.max(...products.map((p) => p.price)) / 1000) * 1000;

export const emptyFilters = () => ({
  q: '',
  sort: 'popular',
  only: '',
  category: [],
  gender: [],
  size: [],
  color: [],
  min: PRICE_MIN,
  max: PRICE_MAX,
});

export function parseFilters(params) {
  const filters = emptyFilters();
  filters.q = params.get('q') || '';
  filters.sort = params.get('sort') || 'popular';
  filters.only = params.get('only') || '';
  LIST_KEYS.forEach((key) => {
    const value = params.get(key);
    filters[key] = value ? value.split(',').filter(Boolean) : [];
  });
  const min = Number(params.get('min'));
  const max = Number(params.get('max'));
  if (params.has('min') && Number.isFinite(min)) filters.min = min;
  if (params.has('max') && Number.isFinite(max)) filters.max = max;
  return filters;
}

// Обратно в строку: пустые значения и значения по умолчанию не пишем
export function filtersToParams(filters) {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.sort && filters.sort !== 'popular') params.set('sort', filters.sort);
  if (filters.only) params.set('only', filters.only);
  LIST_KEYS.forEach((key) => {
    if (filters[key].length) params.set(key, filters[key].join(','));
  });
  if (filters.min > PRICE_MIN) params.set('min', String(filters.min));
  if (filters.max < PRICE_MAX) params.set('max', String(filters.max));
  return params;
}

const normalize = (text) => text.toLowerCase().replace(/ё/g, 'е').trim();

const intersects = (selected, values) => !selected.length || selected.some((id) => values.includes(id));

export function filterProducts(list, filters, history = []) {
  const query = normalize(filters.q);
  return list.filter((p) => {
    if (filters.only === 'recent' && !history.includes(p.id)) return false;
    if (filters.category.length && !filters.category.includes(p.category)) return false;
    if (!intersects(filters.gender, p.gender)) return false;
    if (!intersects(filters.size, p.sizes)) return false;
    if (!intersects(filters.color, p.colors)) return false;
    if (p.price < filters.min || p.price > filters.max) return false;
    if (query && !normalize(p.name).includes(query)) return false;
    return true;
  });
}

const sorters = {
  popular: (a, b) => a.popularity - b.popularity,
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

export const sortProducts = (list, sort) => [...list].sort(sorters[sort] || sorters.popular);

// Сколько фильтров выбрано (бейдж на мобильной кнопке «Фильтры»)
export const countFilters = (filters) =>
  LIST_KEYS.reduce((sum, key) => sum + filters[key].length, 0) +
  (filters.min > PRICE_MIN || filters.max < PRICE_MAX ? 1 : 0);

// Похожие товары — та же категория; «с этим покупают» — другие категории
export const similarProducts = (product, limit = 4) =>
  sortProducts(products.filter((p) => p.id !== product.id && p.category === product.category), 'popular').slice(0, limit);

export const relatedProducts = (product, limit = 4) =>
  sortProducts(products.filter((p) => p.category !== product.category), 'popular').slice(0, limit);
