// Справочники каталога. На этапе 2 их будет редактировать админка (создание товара)

export const categories = [
  { id: 'clothes', name: 'Одежда' },
  { id: 'beachwear', name: 'Пляжная одежда' },
  { id: 'shoes', name: 'Обувь' },
  { id: 'accessories', name: 'Аксессуары' },
];

export const genders = [
  { id: 'girls', name: 'Девочки' },
  { id: 'boys', name: 'Мальчики' },
  { id: 'women', name: 'Женщины' },
  { id: 'men', name: 'Мужчины' },
];

// Размеры: первые четыре видны сразу, остальные — по «… еще»
export const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '36', '37', '38', '39', '40'].map((id) => ({
  id,
  name: id,
}));

// hex — цвет кружка в карточке товара
export const colors = [
  { id: 'black', name: 'Черный', hex: '#322f56' },
  { id: 'white', name: 'Белый', hex: '#ffffff' },
  { id: 'red', name: 'Красный', hex: '#ff5a5a' },
  { id: 'blue', name: 'Синий', hex: '#4a6bb5' },
  { id: 'beige', name: 'Бежевый', hex: '#f0dec6' },
  { id: 'lightblue', name: 'Голубой', hex: '#b9d3ee' },
  { id: 'yellow', name: 'Желтый', hex: '#e8b85a' },
  { id: 'brown', name: 'Коричневый', hex: '#92551f' },
  { id: 'mint', name: 'Мятный', hex: '#c7e3d4' },
  { id: 'grey', name: 'Серый', hex: '#8c8c96' },
  { id: 'multi', name: 'Мультицвет', hex: 'conic-gradient(#e3a874, #b9d3ee, #ff5a5a, #c7e3d4, #e3a874)' },
];

export const sortOptions = [
  { id: 'popular', name: 'По популярности' },
  { id: 'new', name: 'По новизне' },
  { id: 'rating', name: 'По рейтингу' },
  { id: 'price-asc', name: 'Сначала дешевле' },
  { id: 'price-desc', name: 'Сначала дороже' },
];

const byId = (list) => Object.fromEntries(list.map((item) => [item.id, item]));
export const categoryById = byId(categories);
export const genderById = byId(genders);
export const colorById = byId(colors);
