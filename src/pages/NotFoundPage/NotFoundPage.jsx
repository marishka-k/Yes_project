import Container from '../../components/Container/Container';
import PageTitle from '../../components/PageTitle/PageTitle';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <Container className={styles['not-found-page']}>
      <PageTitle className={styles['not-found-page__title']}>Страница не найдена</PageTitle>
      <EmptyState icon="search" title="Такой страницы нет" text="Возможно, ссылка устарела." action={{ label: 'На главную', to: '/' }} />
    </Container>
  );
}
