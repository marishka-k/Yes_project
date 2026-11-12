import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '../../components/Container/Container';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import PageTitle from '../../components/PageTitle/PageTitle';
import Select from '../../components/Select/Select';
import Chip from '../../components/Chip/Chip';
import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';
import Drawer from '../../components/Drawer/Drawer';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import EmptyState from '../../components/EmptyState/EmptyState';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useStore } from '../../store/StoreContext';
import { useCatalog } from '../../store/CatalogContext';
import { categories, categoryById, colorById, genderById, sortOptions } from '../../data/categories';
import { PRICE_MAX, PRICE_MIN, countFilters, filterProducts, filtersToParams, parseFilters, sortProducts } from '../../utils/catalog';
import { formatNumber, plural } from '../../utils/format';
import styles from './CatalogPage.module.css';

// Снятые фильтры-плашки под сортировкой: что выбрано и как это убрать
function activeTags(filters) {
  const tags = [];
  if (filters.q) tags.push({ key: 'q', label: `Поиск: ${filters.q}`, remove: { q: '' } });
  if (filters.only === 'recent') tags.push({ key: 'only', label: 'Недавно смотрели', remove: { only: '' } });
  const list = (key, dict) =>
    filters[key].forEach((id) =>
      tags.push({ key: `${key}-${id}`, label: dict ? dict[id]?.name || id : id, remove: { [key]: filters[key].filter((x) => x !== id) } }),
    );
  if (filters.category.length > 1) list('category', categoryById);
  list('gender', genderById);
  list('size');
  list('color', colorById);
  if (filters.min > PRICE_MIN || filters.max < PRICE_MAX) {
    tags.push({
      key: 'price',
      label: `${formatNumber(filters.min)} – ${formatNumber(filters.max)} ₽`,
      remove: { min: PRICE_MIN, max: PRICE_MAX },
    });
  }
  return tags;
}

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const { history } = useStore();
  const { products } = useCatalog();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = params.toString();
  const filters = useMemo(() => parseFilters(new URLSearchParams(query)), [query]);
  const list = useMemo(() => sortProducts(filterProducts(products, filters, history), filters.sort), [products, filters, history]);

  const update = (patch) => setParams(filtersToParams({ ...filters, ...patch }), { replace: true });
  const applyPanel = (next) => {
    setParams(filtersToParams(next), { replace: true });
    setFiltersOpen(false);
  };

  const toggleCategory = (id) => update({ category: filters.category.length === 1 && filters.category[0] === id ? [] : [id] });
  const singleCategory = filters.category.length === 1 ? categoryById[filters.category[0]] : null;
  const tags = activeTags(filters);
  const filterCount = countFilters(filters);

  const crumbs = [
    { label: 'Главная', to: '/' },
    { label: 'Каталог товаров', to: '/catalog' },
    ...(singleCategory ? [{ label: singleCategory.name }] : []),
  ];

  const panel = <FilterPanel value={filters} onApply={applyPanel} hideTitle={!isDesktop} />;

  return (
    <Container className={styles['catalog-page']}>
      {isDesktop && <aside className={styles['catalog-page__aside']}>{panel}</aside>}

      <div className={styles['catalog-page__content']}>
        <Breadcrumbs items={crumbs} />
        <PageTitle className={styles['catalog-page__title']}>Каталог товаров</PageTitle>

        <div className={styles['catalog-page__toolbar']}>
          {!isDesktop && (
            <Button variant="secondary" className={styles['catalog-page__filters-button']} onClick={() => setFiltersOpen(true)} aria-haspopup="dialog">
              <Icon name="filter" width={20} />
              Фильтры
              {filterCount > 0 && <span className={styles['catalog-page__badge']}>{filterCount}</span>}
            </Button>
          )}
          <Select
            className={styles['catalog-page__sort']}
            label="Сортировка"
            options={sortOptions}
            value={filters.sort}
            onChange={(sort) => update({ sort })}
          />
          <ul className={styles['catalog-page__chips']} aria-label="Категории">
            {categories.map((category) => (
              <li key={category.id}>
                <Chip selected={filters.category.length === 1 && filters.category[0] === category.id} onClick={() => toggleCategory(category.id)}>
                  {category.name}
                </Chip>
              </li>
            ))}
          </ul>
        </div>

        {tags.length > 0 && (
          <ul className={styles['catalog-page__tags']} aria-label="Выбранные фильтры">
            {tags.map((tag) => (
              <li key={tag.key}>
                <Chip variant="tag" onClick={() => update(tag.remove)}>
                  {tag.label}
                </Chip>
              </li>
            ))}
          </ul>
        )}

        <p className="visually-hidden" aria-live="polite">
          Найдено {list.length} {plural(list.length, ['товар', 'товара', 'товаров'])}
        </p>

        {list.length ? (
          <ProductGrid products={list} columns="catalog" className={styles['catalog-page__grid']} />
        ) : (
          <EmptyState
            icon="search"
            title="Ничего не найдено"
            text="Попробуйте изменить запрос или снять часть фильтров."
            action={{ label: 'Очистить фильтры', to: '/catalog' }}
          />
        )}
      </div>

      {!isDesktop && (
        <Drawer isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} title="Фильтры">
          {panel}
        </Drawer>
      )}
    </Container>
  );
}
