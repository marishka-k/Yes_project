import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage/AdminPage';
import AdminPageHead from '../../../components/admin/AdminPageHead/AdminPageHead';
import AdminNotice from '../../../components/admin/AdminNotice/AdminNotice';
import DataTable from '../../../components/admin/DataTable/DataTable';
import Pagination from '../../../components/admin/Pagination/Pagination';
import IconButton from '../../../components/admin/IconButton/IconButton';
import ConfirmModal from '../../../components/admin/ConfirmModal/ConfirmModal';
import Button from '../../../components/Button/Button';
import Chip from '../../../components/Chip/Chip';
import SearchField from '../../../components/SearchField/SearchField';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { useCatalog } from '../../../store/CatalogContext';
import { categories, categoryById, colorById } from '../../../data/categories';
import { formatPrice } from '../../../utils/format';
import usePaged from '../../../hooks/usePaged';
import styles from './ProductsPage.module.css';

const PER_PAGE = 8;
const normalize = (text) => text.toLowerCase().replace(/ё/g, 'е').trim();

// Каталог товаров → Активные товары / Товары в архиве (макет Desktop analytics-1):
// фильтр по категории, поиск по названию и артикулу, удаление, правка, «в архив / из архива»
export default function ProductsPage({ archived = false }) {
  const { allProducts, setArchived, deleteProduct } = useCatalog();
  const location = useLocation();
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState(null);

  const list = useMemo(() => {
    const q = normalize(query);
    return allProducts
      .filter((p) => p.archived === archived)
      .filter((p) => !category || p.category === category)
      .filter((p) => !q || normalize(p.name).includes(q) || p.article.includes(q));
  }, [allProducts, archived, category, query]);

  const { page, pages, setPage, items } = usePaged(list, PER_PAGE, `${category}|${query}`);
  const title = archived ? 'Товары в архиве' : 'Список активных товаров';

  const toggleArchive = (product) => {
    setArchived(product.id, !archived);
    setNotice(`«${product.name}» (код ${product.article}) ${archived ? 'снова на витрине' : 'перенесён в архив и скрыт с витрины'}`);
  };

  const confirmDelete = () => {
    deleteProduct(toDelete.id);
    setNotice(`«${toDelete.name}» (код ${toDelete.article}) удалён`);
    setToDelete(null);
  };

  const columns = [
    {
      key: 'name',
      title: 'Товар',
      rowHeader: true,
      hideLabel: true,
      className: styles['products-page__col-name'],
      render: (p) => (
        <>
          <span className={styles['products-page__name']}>{p.name}</span>
          <span className={styles['products-page__meta']}>категория: {categoryById[p.category]?.name.toLowerCase()}</span>
          <span className={styles['products-page__meta']}>код: {p.article}</span>
        </>
      ),
    },
    {
      key: 'colors',
      title: 'Цвета',
      className: styles['products-page__col-colors'],
      render: (p) => (
        <ul className={styles['products-page__values']}>
          {p.colors.map((c) => (
            <li key={c}>{colorById[c]?.name || c}</li>
          ))}
        </ul>
      ),
    },
    {
      key: 'sizes',
      title: 'Размеры',
      className: styles['products-page__col-sizes'],
      render: (p) =>
        p.sizes.length ? (
          <ul className={styles['products-page__values']}>
            {p.sizes.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        ) : (
          '—'
        ),
    },
    { key: 'price', title: 'Цена', className: styles['products-page__col-price'], render: (p) => formatPrice(p.oldPrice || p.price) },
    {
      key: 'discount',
      title: 'Скидка',
      className: styles['products-page__col-discount'],
      render: (p) => <span className={styles['products-page__discount']}>{formatPrice(p.oldPrice ? p.oldPrice - p.price : 0)}</span>,
    },
    {
      key: 'actions',
      title: 'Действия',
      hideLabel: true,
      className: styles['products-page__col-actions'],
      render: (p) => (
        <div className={styles['products-page__actions']}>
          <IconButton icon="trash" iconWidth={18} label={`Удалить «${p.name}»`} tip="Удалить" onClick={() => setToDelete(p)} />
          <IconButton icon="pencil" label={`Изменить «${p.name}»`} tip="Изменить" to={`/admin/products/${p.id}/edit`} />
          <IconButton
            icon={archived ? 'eye' : 'eye-off'}
            iconWidth={24}
            label={archived ? `Вернуть «${p.name}» на витрину` : `Скрыть «${p.name}» в архив`}
            tip={archived ? 'Вернуть' : 'Скрыть'}
            onClick={() => toggleArchive(p)}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminPage crumbs={[{ label: 'Товары' }, { label: 'Каталог товаров', to: '/admin/products' }, { label: title }]}>
      <AdminPageHead title={title}>
        <Button to="/admin/products/new">Добавить товар</Button>
      </AdminPageHead>

      <div className={styles['products-page__filters']}>
        <ul className={styles['products-page__chips']} aria-label="Категория">
          {categories.map((c) => (
            <li key={c.id}>
              <Chip selected={category === c.id} onClick={() => setCategory(category === c.id ? '' : c.id)}>
                {c.name}
              </Chip>
            </li>
          ))}
        </ul>
        <SearchField className={styles['products-page__search']} label="Поиск по названию или коду товара" value={query} onChange={setQuery} />
      </div>

      {notice && <AdminNotice onClose={() => setNotice('')}>{notice}</AdminNotice>}

      {items.length ? (
        <>
          <DataTable caption={`${title}, страница ${page} из ${pages}`} columns={columns} rows={items} rowKey={(p) => p.id} headHidden />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      ) : (
        <EmptyState
          icon="search"
          title={query || category ? 'Ничего не найдено' : archived ? 'В архиве пусто' : 'Активных товаров нет'}
          text={archived ? 'Скрытые с витрины товары появятся здесь.' : undefined}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(toDelete)}
        title="Удалить товар?"
        text={toDelete ? `«${toDelete.name}», код ${toDelete.article}. Товар пропадёт с витрины и из админки. Вернуть его можно сбросом каталога в «Настройке».` : ''}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </AdminPage>
  );
}
