import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage/AdminPage';
import AdminNotice from '../../../components/admin/AdminNotice/AdminNotice';
import ProductForm from '../../../components/admin/ProductForm/ProductForm';
import PageTitle from '../../../components/PageTitle/PageTitle';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { useCatalog } from '../../../store/CatalogContext';
import { emptyProductForm, formToProduct, nextArticle, productToForm } from '../../../utils/productForm';
import styles from './ProductEditPage.module.css';

// «Добавить товар» (/admin/products/new) и «Изменить товар» (/admin/products/:id/edit).
// Сохранение пишет товар в localStorage — витрина показывает его сразу
export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts, allProductById, saveProduct } = useCatalog();
  const [saved, setSaved] = useState(0);
  const product = id ? allProductById[id] : null;
  const isEdit = Boolean(id);
  const title = isEdit ? 'Изменить товар' : 'Добавить товар';

  // Значения формы пересчитываются после сохранения: «Отменить изменения» вернёт уже сохранённое
  const initial = useMemo(
    () => (product ? productToForm(product) : emptyProductForm(nextArticle(allProducts))),
    [product?.id, saved], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const crumbs = [{ label: 'Товары' }, { label: 'Каталог товаров', to: '/admin/products' }, { label: title }];

  if (isEdit && !product) {
    return (
      <AdminPage crumbs={crumbs}>
        <EmptyState icon="search" title="Товар не найден" text="Возможно, он удалён." action={{ label: 'К списку товаров', to: '/admin/products' }} />
      </AdminPage>
    );
  }

  const handleSubmit = (values) => {
    const next = formToProduct(values, product);
    saveProduct(next);
    if (isEdit) {
      setSaved((n) => n + 1);
    } else {
      navigate('/admin/products', { state: { notice: `Товар «${next.name}» создан и уже виден на витрине` } });
    }
  };

  return (
    <AdminPage crumbs={crumbs} sidebar={false}>
      <PageTitle className={styles['product-edit-page__title']}>{title}</PageTitle>
      {product?.archived && (
        <AdminNotice>
          Товар в архиве — на витрине он не показывается. Вернуть: <Link to="/admin/products/archive">Товары в архиве</Link>.
        </AdminNotice>
      )}
      {saved > 0 && (
        <AdminNotice onClose={() => setSaved(0)}>
          Изменения сохранены.{' '}
          {!product.archived && <Link to={`/product/${product.id}`}>Посмотреть на витрине</Link>}
        </AdminNotice>
      )}
      <ProductForm key={`${id || 'new'}-${saved}`} initial={initial} mode={isEdit ? 'edit' : 'create'} productId={id} onSubmit={handleSubmit} />
    </AdminPage>
  );
}
