import Container from '../../components/Container/Container';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import PageTitle from '../../components/PageTitle/PageTitle';
import EmptyState from '../../components/EmptyState/EmptyState';
import Button from '../../components/Button/Button';
import { useStore } from '../../store/StoreContext';
import { orderStatuses, paymentStatuses } from '../../data/orders';
import { formatDate, formatPrice } from '../../utils/format';
import styles from './ProfilePage.module.css';

// Личный кабинет (упрощённо): заказы из localStorage.
// Статусы меняются в админке (этап 2), вход в неё — кнопкой внизу страницы
export default function ProfilePage() {
  const { orders } = useStore();

  return (
    <Container className={styles['profile-page']}>
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Личный кабинет' }, { label: 'Заказы' }]} />
      <PageTitle className={styles['profile-page__title']}>Заказы</PageTitle>
      {orders.length ? (
        <div className={styles['profile-page__table-wrap']}>
          <table className={styles['profile-page__table']}>
            <thead>
              <tr>
                <th scope="col">Номер заказа</th>
                <th scope="col">Дата</th>
                <th scope="col">Сумма к оплате</th>
                <th scope="col">Статус оплаты</th>
                <th scope="col">Статус заказа</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.number}>
                  <td data-label="Номер заказа">{order.number}</td>
                  <td data-label="Дата">{formatDate(order.createdAt)}</td>
                  <td data-label="Сумма к оплате">{formatPrice(order.totals.total)}</td>
                  <td data-label="Статус оплаты">{paymentStatuses[order.paymentStatus]}</td>
                  <td data-label="Статус заказа">{orderStatuses[order.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="user" title="Заказов пока нет" text="Оформленные заказы появятся здесь." action={{ label: 'Перейти в каталог', to: '/catalog' }} />
      )}
      <p className={styles['profile-page__note']}>Демо: заказы хранятся только в этом браузере.</p>
      <div className={styles['profile-page__admin']}>
        <p>Учебная админка: аналитика продаж, товары, заказы и покупатели. Без авторизации.</p>
        <Button to="/admin" variant="secondary">
          Перейти в админку
        </Button>
      </div>
    </Container>
  );
}
