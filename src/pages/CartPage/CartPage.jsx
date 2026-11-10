import Container from '../../components/Container/Container';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import PageTitle from '../../components/PageTitle/PageTitle';
import CartItem from '../../components/CartItem/CartItem';
import CartSummary from '../../components/CartSummary/CartSummary';
import EmptyState from '../../components/EmptyState/EmptyState';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { useStore } from '../../store/StoreContext';
import { products, productById } from '../../data/products';
import { sortProducts } from '../../utils/catalog';
import { cartLines } from '../../utils/order';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { cart, history, setQty, removeLine } = useStore();
  const lines = cartLines(cart);
  const inCart = new Set(lines.map((l) => l.id));
  const recent = history.map((id) => productById[id]).filter(Boolean).slice(0, 4);
  const recommended = sortProducts(products.filter((p) => !inCart.has(p.id)), 'rating').slice(0, 4);

  return (
    <div className={styles['cart-page']}>
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Корзина товаров' }]} />
        <PageTitle className={styles['cart-page__title']}>Корзина товаров</PageTitle>

        {lines.length ? (
          <div className={styles['cart-page__layout']}>
            <ul className={styles['cart-page__list']} aria-label="Товары в корзине">
              {lines.map((line) => (
                <li key={line.key}>
                  <CartItem line={line} onQty={setQty} onRemove={removeLine} />
                </li>
              ))}
            </ul>
            <CartSummary lines={lines} />
          </div>
        ) : (
          <EmptyState
            title="В корзине пока пусто"
            text="Загляните в каталог — там купальники, одежда и аксессуары для пляжа."
            action={{ label: 'Перейти в каталог', to: '/catalog' }}
          />
        )}
      </Container>

      {recent.length > 0 && (
        <Container as="section" className={styles['cart-page__section']} aria-labelledby="cart-recent">
          <PageTitle as="h2" id="cart-recent" className={styles['cart-page__section-title']}>
            Недавно смотрели
          </PageTitle>
          <ProductGrid products={recent} />
        </Container>
      )}

      <Container as="section" className={styles['cart-page__section']} aria-labelledby="cart-recommended">
        <PageTitle as="h2" id="cart-recommended" className={styles['cart-page__section-title']}>
          Рекомендуемые товары
        </PageTitle>
        <ProductGrid products={recommended} />
      </Container>
    </div>
  );
}
