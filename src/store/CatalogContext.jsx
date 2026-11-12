import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { products as baseProducts } from '../data/products';
import { categories, categoryById, colorById, colors, sizes } from '../data/categories';
import { collections, compositions, linings } from '../data/productOptions';

// Каталог = базовые товары из src/data/products.js + правки админки (localStorage):
// yes:admin:products — изменённые и созданные товары целиком ({ [id]: товар }),
// yes:admin:archived — id товаров в архиве (на витрине не показываются),
// yes:admin:deleted — id удалённых товаров,
// yes:admin:dictionaries — значения справочников, добавленные кнопкой «+» в форме товара
const CatalogContext = createContext(null);

const emptyDictionaries = { categories: [], colors: [], sizes: [], collections: [], compositions: [], linings: [] };

// Добавленные значения дописываются прямо в общие списки справочников,
// чтобы их без доработок увидели фильтры каталога, карточка товара и корзина
function extendDictionaries(extra) {
  extra.categories.forEach((c) => {
    if (!categoryById[c.id]) {
      categories.push(c);
      categoryById[c.id] = c;
    }
  });
  extra.colors.forEach((c) => {
    if (!colorById[c.id]) {
      colors.push(c);
      colorById[c.id] = c;
    }
  });
  extra.sizes.forEach((s) => {
    if (!sizes.some((x) => x.id === s)) sizes.push({ id: s, name: s });
  });
  [
    [collections, extra.collections],
    [compositions, extra.compositions],
    [linings, extra.linings],
  ].forEach(([list, added]) => added.forEach((value) => !list.includes(value) && list.push(value)));
}

// id для нового значения справочника: латиница не нужна, достаточно уникальности
const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}`;

export function CatalogProvider({ children }) {
  const [edited, setEdited] = useLocalStorage('yes:admin:products', {});
  const [archived, setArchivedIds] = useLocalStorage('yes:admin:archived', []);
  const [deleted, setDeleted] = useLocalStorage('yes:admin:deleted', []);
  const [dictionaries, setDictionaries] = useLocalStorage('yes:admin:dictionaries', emptyDictionaries);

  const dict = useMemo(() => ({ ...emptyDictionaries, ...dictionaries }), [dictionaries]);
  useMemo(() => extendDictionaries(dict), [dict]);

  const allProducts = useMemo(() => {
    const baseIds = new Set(baseProducts.map((p) => p.id));
    const created = Object.values(edited).filter((p) => !baseIds.has(p.id));
    return [...baseProducts.map((p) => edited[p.id] || p), ...created]
      .filter((p) => !deleted.includes(p.id))
      .map((p) => ({ ...p, archived: archived.includes(p.id) }));
  }, [edited, archived, deleted]);

  const products = useMemo(() => allProducts.filter((p) => !p.archived), [allProducts]);
  const productById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const allProductById = useMemo(() => Object.fromEntries(allProducts.map((p) => [p.id, p])), [allProducts]);

  const saveProduct = useCallback(
    (product) => {
      const { archived: _archived, ...data } = product;
      setEdited((prev) => ({ ...prev, [data.id]: data }));
    },
    [setEdited],
  );

  const setArchived = useCallback(
    (id, value) => setArchivedIds((prev) => (value ? [...new Set([...prev, id])] : prev.filter((x) => x !== id))),
    [setArchivedIds],
  );

  const deleteProduct = useCallback(
    (id) => {
      setDeleted((prev) => [...new Set([...prev, id])]);
      setArchivedIds((prev) => prev.filter((x) => x !== id));
    },
    [setDeleted, setArchivedIds],
  );

  // kind: categories | colors (value — { name, hex }) | sizes | collections | compositions | linings.
  // Возвращает то, что попадёт в товар: id для категорий и цветов, само значение для остальных
  const addDictionaryValue = useCallback(
    (kind, value) => {
      let entry = value;
      if (kind === 'categories') entry = { id: makeId('category'), name: value };
      if (kind === 'colors') entry = { id: makeId('color'), name: value.name, hex: value.hex };
      setDictionaries((prev) => ({ ...emptyDictionaries, ...prev, [kind]: [...(prev[kind] || []), entry] }));
      return entry.id || entry;
    },
    [setDictionaries],
  );

  const resetCatalog = useCallback(() => {
    setEdited({});
    setArchivedIds([]);
    setDeleted([]);
  }, [setEdited, setArchivedIds, setDeleted]);

  const value = useMemo(
    () => ({ products, productById, allProducts, allProductById, saveProduct, setArchived, deleteProduct, addDictionaryValue, resetCatalog }),
    [products, productById, allProducts, allProductById, saveProduct, setArchived, deleteProduct, addDictionaryValue, resetCatalog],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => useContext(CatalogContext);
