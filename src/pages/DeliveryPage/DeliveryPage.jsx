import Container from '../../components/Container/Container';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import PageTitle from '../../components/PageTitle/PageTitle';
import Button from '../../components/Button/Button';
import { deliveryInfo } from '../../data/delivery';
import styles from './DeliveryPage.module.css';

// «Доставка» из меню (в макете страницы нет — сделана в стиле карточек)
export default function DeliveryPage() {
  return (
    <Container className={styles['delivery-page']}>
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Доставка' }]} />
      <PageTitle className={styles['delivery-page__title']}>Доставка</PageTitle>
      <ul className={styles['delivery-page__list']}>
        {deliveryInfo.map((item) => (
          <li key={item.id} className={styles['delivery-page__card']}>
            <h2 className={styles['delivery-page__name']}>{item.title}</h2>
            <p>{item.text}</p>
            <p className={styles['delivery-page__price']}>{item.price}</p>
          </li>
        ))}
      </ul>
      <p className={styles['delivery-page__note']}>Способ доставки и адрес выбираются при оформлении заказа.</p>
      <Button to="/catalog" className={styles['delivery-page__button']}>
        Перейти в каталог
      </Button>
    </Container>
  );
}
