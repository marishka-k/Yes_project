import Hero from '../../components/Hero/Hero';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import Container from '../../components/Container/Container';
import { useStore } from '../../store/StoreContext';
import { useCatalog } from '../../store/CatalogContext';
import { HOME_LIMIT, homeSections } from '../../data/content';
import { sortProducts } from '../../utils/catalog';
import styles from './HomePage.module.css';

// Раздел главной: плашка с заголовком и «Показать еще», под ней 4 карточки
function HomeSection({ id, title, link, note, items }) {
  return (
    <section className={styles['home-page__section']} aria-labelledby={id}>
      <SectionHeader id={id} title={title} link={link} />
      <Container className={styles['home-page__cards']}>
        {note && <p className={styles['home-page__note']}>{note}</p>}
        <ProductGrid products={items} />
      </Container>
    </section>
  );
}

export default function HomePage() {
  const { history } = useStore();
  const { products, productById } = useCatalog();
  const recent = history.map((id) => productById[id]).filter(Boolean).slice(0, HOME_LIMIT);
  const hasRecent = recent.length > 0;

  return (
    <div className={styles['home-page']}>
      <Hero />
      {/* Без истории просмотров — подсказка и товары с лучшими оценками */}
      <HomeSection
        id="home-recent"
        title={homeSections.recent.title}
        link={hasRecent ? homeSections.recent.link : homeSections.recentEmpty.link}
        note={hasRecent ? null : homeSections.recentEmpty.note}
        items={hasRecent ? recent : sortProducts(products, 'rating').slice(0, HOME_LIMIT)}
      />
      <HomeSection id="home-new" {...homeSections.fresh} items={sortProducts(products, 'new').slice(0, HOME_LIMIT)} />
      <HomeSection id="home-popular" {...homeSections.popular} items={sortProducts(products, 'popular').slice(0, HOME_LIMIT)} />
    </div>
  );
}
