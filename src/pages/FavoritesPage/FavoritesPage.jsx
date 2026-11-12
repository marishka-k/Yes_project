import Container from '../../components/Container/Container';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import PageTitle from '../../components/PageTitle/PageTitle';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import EmptyState from '../../components/EmptyState/EmptyState';
import { useStore } from '../../store/StoreContext';
import { useCatalog } from '../../store/CatalogContext';
import styles from './FavoritesPage.module.css';

export default function FavoritesPage() {
  const { favorites } = useStore();
  const { productById } = useCatalog();
  const list = favorites.map((id) => productById[id]).filter(Boolean);

  return (
    <Container className={styles['favorites-page']}>
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Избранное' }]} />
      <PageTitle className={styles['favorites-page__title']}>Избранное</PageTitle>
      {list.length ? (
        <ProductGrid products={list} />
      ) : (
        <EmptyState
          icon="heart"
          title="Здесь пока ничего нет"
          text="Нажмите на сердечко на карточке товара, чтобы сохранить его здесь."
          action={{ label: 'Перейти в каталог', to: '/catalog' }}
        />
      )}
    </Container>
  );
}
