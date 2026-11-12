import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage/AdminPage';
import AdminNotice from '../../../components/admin/AdminNotice/AdminNotice';
import OrderComposition from '../../../components/admin/OrderComposition/OrderComposition';
import OrderTimeline from '../../../components/admin/OrderTimeline/OrderTimeline';
import IconButton from '../../../components/admin/IconButton/IconButton';
import PageTitle from '../../../components/PageTitle/PageTitle';
import Select from '../../../components/Select/Select';
import Button from '../../../components/Button/Button';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { useAdmin } from '../../../store/AdminContext';
import { groupOfStatus, orderGroups, orderStatuses, paymentStatuses } from '../../../data/orders';
import { deliveryInfo, deliveryMethodById } from '../../../data/delivery';
import { paymentMethods } from '../../../data/checkout';
import { formatDate } from '../../../utils/format';
import styles from './OrderPage.module.css';

const toOptions = (map) => Object.entries(map).map(([id, name]) => ({ id, name }));
const statusOptions = toOptions(orderStatuses);
const paymentOptions = toOptions(paymentStatuses);

function formatAddress({ method, ...a }) {
  if (method === 'sdek') return [a.country, a.city, a.address].filter(Boolean).join(', ');
  return [a.index, a.city, a.street, a.house && `д. ${a.house}`, a.building && `корп. ${a.building}`, a.flat && `кв. ${a.flat}`].filter(Boolean).join(', ');
}

// Ожидаемая дата доставки: дата заказа + верхняя граница срока службы (3-7 дней → 7)
function deliveryDate(order) {
  const days = Number(deliveryMethodById[order.delivery.method]?.term.match(/(\d+)\s*дн/)?.[1]) || 7;
  const date = new Date(order.createdAt);
  date.setDate(date.getDate() + days);
  return formatDate(date.toISOString());
}

// Карточка заказа (макет order info): состав, детали доставки со шкалой статусов,
// покупатель и оплата, смена статуса заказа и оплаты — итоги аналитики пересчитываются сразу
export default function OrderPage() {
  const { number } = useParams();
  const { orderByNumber, updateOrderStatus } = useAdmin();
  const order = orderByNumber[number];
  const [draft, setDraft] = useState(null);
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);

  if (!order) {
    return (
      <AdminPage crumbs={[{ label: 'Заказы', to: '/admin/orders/active' }, { label: `№ ${number}` }]}>
        <EmptyState icon="search" title="Заказ не найден" action={{ label: 'К заказам', to: '/admin/orders/active' }} />
      </AdminPage>
    );
  }

  const group = groupOfStatus(order.status);
  const values = draft || { status: order.status, paymentStatus: order.paymentStatus };
  const changed = values.status !== order.status || values.paymentStatus !== order.paymentStatus;
  const tracking = order.status !== 'created' && order.status !== 'cancelled' ? `RU${order.number.padStart(12, '0').slice(-12)}` : '';
  const { customer } = order;

  const save = (event) => {
    event.preventDefault();
    updateOrderStatus(order.number, values);
    setDraft(null);
    setNotice(`Статус сохранён: ${orderStatuses[values.status]}, ${paymentStatuses[values.paymentStatus].toLowerCase()}. Итоги в аналитике обновлены.`);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tracking);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AdminPage
      crumbs={[
        { label: 'Заказы' },
        { label: orderGroups[group].crumb, to: `/admin/orders/${group}` },
        { label: order.number },
      ]}
    >
      <PageTitle className={styles['order-page__title']}>Заказ № {order.number}</PageTitle>
      <p className={styles['order-page__subtitle']}>
        от {formatDate(order.createdAt)}
        {order.demo ? ' · демо-заказ' : ' · заказ с витрины'}
      </p>

      {notice && <AdminNotice onClose={() => setNotice('')}>{notice}</AdminNotice>}

      <div className={styles['order-page__columns']}>
        <section className={styles['order-page__section']} aria-labelledby="order-items">
          <h2 id="order-items" className={styles['order-page__heading']}>
            Состав заказа
          </h2>
          <OrderComposition order={order} />
        </section>

        <section className={styles['order-page__section']} aria-labelledby="order-delivery">
          <h2 id="order-delivery" className={styles['order-page__heading']}>
            Детали доставки
          </h2>
          <dl className={styles['order-page__facts']}>
            <div className={styles['order-page__fact']}>
              <dt>Служба доставки:</dt>
              <dd className={styles['order-page__fact-value']}>{deliveryInfo.find((d) => d.id === order.delivery.method)?.title}</dd>
            </div>
            <div className={styles['order-page__fact']}>
              <dt>Дата доставки:</dt>
              <dd className={styles['order-page__fact-value']}>{deliveryDate(order)}</dd>
            </div>
            <div className={styles['order-page__fact']}>
              <dt>Номер для отслеживания:</dt>
              <dd className={styles['order-page__tracking']}>
                {tracking ? (
                  <>
                    <span className={styles['order-page__tracking-number']}>{tracking}</span>
                    <IconButton icon="copy" iconWidth={18} label={copied ? 'Скопировано' : 'Скопировать номер'} onClick={copy} />
                  </>
                ) : (
                  <span className={styles['order-page__muted']}>появится после передачи в доставку</span>
                )}
              </dd>
            </div>
          </dl>
          <OrderTimeline status={order.status} />
        </section>

        <section className={styles['order-page__section']} aria-labelledby="order-customer">
          <h2 id="order-customer" className={styles['order-page__heading']}>
            Покупатель и оплата
          </h2>
          <dl className={styles['order-page__card']}>
            {[
              ['Покупатель', [customer.lastName, customer.firstName, customer.middleName].filter(Boolean).join(' ')],
              ['Телефон', customer.phone],
              ['E-mail', customer.email],
              ['Адрес', formatAddress(order.delivery)],
              ...(order.delivery.comment ? [['Комментарий', order.delivery.comment]] : []),
              ['Способ оплаты', paymentMethods.find((m) => m.id === order.payment)?.label],
            ].map(([label, value]) => (
              <div key={label} className={styles['order-page__row']}>
                <dt className={styles['order-page__muted']}>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles['order-page__section']} aria-labelledby="order-status">
          <h2 id="order-status" className={styles['order-page__heading']}>
            Статус заказа
          </h2>
          <form className={styles['order-page__card']} onSubmit={save}>
            <Select
              layout="row"
              className={styles['order-page__select']}
              label="Статус заказа"
              options={statusOptions}
              value={values.status}
              onChange={(status) => setDraft({ ...values, status })}
            />
            <Select
              layout="row"
              className={styles['order-page__select']}
              label="Статус оплаты"
              options={paymentOptions}
              value={values.paymentStatus}
              onChange={(paymentStatus) => setDraft({ ...values, paymentStatus })}
            />
            <div className={styles['order-page__form-actions']}>
              {changed && (
                <Button variant="secondary" onClick={() => setDraft(null)}>
                  Отменить
                </Button>
              )}
              <Button type="submit" disabled={!changed}>
                Сохранить статус
              </Button>
            </div>
          </form>
        </section>
      </div>

      <div className={styles['order-page__back']}>
        <Button to={`/admin/orders/${group}`}>Вернуться к заказам</Button>
      </div>
    </AdminPage>
  );
}
