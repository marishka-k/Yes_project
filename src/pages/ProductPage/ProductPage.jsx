import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Container from '../../components/Container/Container';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Gallery from '../../components/Gallery/Gallery';
import Icon from '../../components/Icon/Icon';
import Chip from '../../components/Chip/Chip';
import Price from '../../components/Price/Price';
import Button from '../../components/Button/Button';
import QuantityControl from '../../components/QuantityControl/QuantityControl';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import PageTitle from '../../components/PageTitle/PageTitle';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useStore } from '../../store/StoreContext';
import { productById } from '../../data/products';
import { categoryById, colorById } from '../../data/categories';
import { reviews } from '../../data/reviews';
import { relatedProducts, similarProducts } from '../../utils/catalog';
import { plural } from '../../utils/format';
import { cx } from '../../utils/cx';
import styles from './ProductPage.module.css';

// Российский размер по размеру производителя (для строки «Описание товара»)
const RU_SIZE = { XS: 42, S: 44, M: 46, L: 48, XL: 50, '2XL': 52, '3XL': 54 };

function ProductDetails({ product }) {
  const { addToCart, qtyInCart, addToHistory } = useStore();
  const [size, setSize] = useState(product.sizes[0] || '');
  const [color, setColor] = useState(product.colors[0] || '');
  const [qty, setQty] = useState(1);
  const inCart = qtyInCart(product.id);
  const category = categoryById[product.category];

  useEffect(() => {
    addToHistory(product.id);
  }, [product.id, addToHistory]);

  const specs = [
    ['Сезон', product.season],
    ['Состав', product.composition],
    ['Состав подкладки', product.lining],
    ['Коллекция', product.collection],
    ['Тип', category.name],
    ...(RU_SIZE[size] ? [['Российский размер', RU_SIZE[size]]] : []),
    ...(size ? [['Размер производителя', size]] : []),
    ['Артикул', product.article],
  ];

  const handleAdd = () => {
    addToCart({ id: product.id, size, color, qty });
    setQty(1);
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Каталог товаров', to: '/catalog' },
          { label: category.name, to: `/catalog?category=${category.id}` },
          { label: product.name },
        ]}
      />

      <div className={styles['product-page__main']}>
        <Gallery key={product.id} product={product} />

        <div className={styles['product-page__info']}>
          <h1 className={styles['product-page__title']}>{product.name}</h1>
          <p className={styles['product-page__rating']}>
            <Icon name="star" width={24} />
            <span>{product.rating}</span>
            <a className={styles['product-page__reviews-link']} href="#reviews" onClick={(e) => { e.preventDefault(); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }}>
              {product.reviews} {plural(product.reviews, ['отзыв', 'отзыва', 'отзывов'])}
            </a>
          </p>

          {product.sizes.length > 0 && (
            <div className={styles['product-page__option']} role="group" aria-labelledby="size-label">
              <span id="size-label" className={styles['product-page__label']}>
                Размер
              </span>
              <ul className={styles['product-page__choices']}>
                {product.sizes.map((s) => (
                  <li key={s}>
                    <Chip className={styles['product-page__size']} selected={s === size} onClick={() => setSize(s)}>
                      {s}
                    </Chip>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles['product-page__option']} role="group" aria-labelledby="color-label">
            <span id="color-label" className={styles['product-page__label']}>
              Цвет
            </span>
            <ul className={styles['product-page__choices']}>
              {product.colors.map((c) => (
                <li key={c}>
                  <Chip className={styles['product-page__color']} selected={c === color} onClick={() => setColor(c)} label={colorById[c].name}>
                    <span className={styles['product-page__swatch']} style={{ background: colorById[c].hex }} />
                  </Chip>
                </li>
              ))}
            </ul>
          </div>

          <h2 className={styles['product-page__label']}>Описание товара:</h2>
          <dl className={styles['product-page__specs']}>
            {specs.map(([label, value]) => (
              <div key={label} className={styles['product-page__spec']}>
                <dt>{label}:</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <Price size="l" value={product.price} old={product.oldPrice} className={styles['product-page__price']} />

          <div className={styles['product-page__actions']}>
            <QuantityControl value={qty} onChange={setQty} name={product.name} />
            <Button size="l" className={styles['product-page__buy']} onClick={handleAdd}>
              В корзину
            </Button>
            <FavoriteButton id={product.id} name={product.name} variant="boxed" />
          </div>
          <p className={styles['product-page__in-cart']} aria-live="polite">
            {inCart > 0 && (
              <>
                В корзине: {inCart} шт. <Link to="/cart">Перейти в корзину</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const product = productById[id];
  if (!product) return <NotFoundPage />;

  return (
    <div className={styles['product-page']}>
      <Container>
        <ProductDetails key={product.id} product={product} />
      </Container>

      <Container as="section" className={styles['product-page__section']} aria-labelledby="reviews">
        <PageTitle as="h2" id="reviews" className={styles['product-page__section-title']}>
          Отзывы покупателей
        </PageTitle>
        <ul className={cx(styles['product-page__reviews'])}>
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </Container>

      <Container as="section" className={styles['product-page__section']} aria-labelledby="related">
        <PageTitle as="h2" id="related" className={styles['product-page__section-title']}>
          С этим товаром покупают
        </PageTitle>
        <ProductGrid products={relatedProducts(product)} />
      </Container>

      <Container as="section" className={styles['product-page__section']} aria-labelledby="similar">
        <PageTitle as="h2" id="similar" className={styles['product-page__section-title']}>
          Похожие товары
        </PageTitle>
        <ProductGrid products={similarProducts(product)} />
      </Container>
    </div>
  );
}
