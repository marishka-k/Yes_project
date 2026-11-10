import { useParams } from 'react-router-dom';
import Container from '../../components/Container/Container';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import PageTitle from '../../components/PageTitle/PageTitle';
import EmptyState from '../../components/EmptyState/EmptyState';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { infoPages } from '../../data/navigation';
import styles from './InfoPage.module.css';

// Информационные разделы из подвала — заглушки учебного проекта
export default function InfoPage() {
  const { slug } = useParams();
  const title = infoPages[slug];
  if (!title) return <NotFoundPage />;

  return (
    <Container className={styles['info-page']}>
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: title }]} />
      <PageTitle className={styles['info-page__title']}>{title}</PageTitle>
      <EmptyState icon="search" title="Раздел в разработке" text="Это учебный проект: текст раздела появится позже." action={{ label: 'На главную', to: '/' }} />
    </Container>
  );
}
