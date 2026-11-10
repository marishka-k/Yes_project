import ProductCard from '../ProductCard/ProductCard';
import { cx } from '../../utils/cx';
import styles from './ProductGrid.module.css';

// Сетка карточек: 2 колонки на телефоне, 3 — на планшете, 4 — от 1024 px.
// columns="catalog" — 3 колонки рядом с фильтрами
export default function ProductGrid({ products, columns = 'page', className, ...rest }) {
  return (
    <ul className={cx(styles['product-grid'], styles[`product-grid_columns_${columns}`], className)} {...rest}>
      {products.map((product) => (
        <li key={product.id} className={styles['product-grid__item']}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
