import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/Container/Container';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import PageTitle from '../../components/PageTitle/PageTitle';
import FormField from '../../components/FormField/FormField';
import Radio from '../../components/Radio/Radio';
import Checkbox from '../../components/Checkbox/Checkbox';
import Button from '../../components/Button/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import DeliveryMapModal from '../../components/DeliveryMapModal/DeliveryMapModal';
import OrderSuccessModal from '../../components/OrderSuccessModal/OrderSuccessModal';
import { useStore } from '../../store/StoreContext';
import { addressFields, deliveryMethods } from '../../data/delivery';
import { consents, paymentMethods, paymentSystems } from '../../data/checkout';
import { asset } from '../../utils/asset';
import { cartLines, makeOrderNumber, orderTotals } from '../../utils/order';
import { formatNumber } from '../../utils/format';
import { validateCheckout } from '../../utils/validate';
import { cx } from '../../utils/cx';
import styles from './CheckoutPage.module.css';

const initialValues = {
  firstName: '',
  lastName: '',
  middleName: '',
  phone: '',
  email: '',
  delivery: 'sdek',
  country: 'Россия',
  city: '',
  address: '',
  index: '',
  street: '',
  house: '',
  building: '',
  flat: '',
  comment: '',
  payment: 'card-online',
  system: 'mastercard',
  cardNumber: '',
  cardHolder: '',
  cardExpiry: '',
  cardCvv: '',
  consents: {},
};

const contactFields = [
  { name: 'firstName', label: 'Имя', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Фамилия', autoComplete: 'family-name' },
  { name: 'middleName', label: 'Отчество (не обязательно)', autoComplete: 'additional-name' },
  { name: 'phone', label: 'Номер телефона', autoComplete: 'tel', type: 'tel', inputMode: 'tel' },
  { name: 'email', label: 'E-mail', autoComplete: 'email', type: 'email', wide: true },
];

const cardFields = [
  { name: 'cardNumber', label: 'Номер карты', inputMode: 'numeric', autoComplete: 'off', maxLength: 19 },
  { name: 'cardHolder', label: 'Держатель на латинском', autoComplete: 'off' },
  { name: 'cardExpiry', label: 'Срок действия (мм/гг)', inputMode: 'numeric', autoComplete: 'off', maxLength: 5 },
  { name: 'cardCvv', label: 'CVV/CVC-код', inputMode: 'numeric', autoComplete: 'off', maxLength: 3, type: 'password' },
];

// Оформление заказа (демо): проверка формы, выбор доставки на карте,
// заказ сохраняется в localStorage (без данных карты), корзина очищается
export default function CheckoutPage() {
  const { cart, promo, clearCart, addOrder } = useStore();
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const formRef = useRef(null);

  const lines = cartLines(cart);
  const totals = orderTotals(lines, { promo, delivery: values.delivery, payment: values.payment });
  const errors = submitted ? validateCheckout(values) : {};
  const allConsents = consents.every((c) => values.consents[c.id]);

  const set = (name) => (event) => setValues((prev) => ({ ...prev, [name]: event.target.value }));
  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));
  const field = (f) => ({ name: f.name, value: values[f.name], onChange: set(f.name), error: errors[f.name] });

  const applyPoint = (point) => {
    setValues((prev) => ({ ...prev, ...point.fill }));
    setMapOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validateCheckout(values);
    if (Object.keys(found).length) {
      // Фокус на первое поле с ошибкой — после отрисовки ошибок
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    const address = Object.fromEntries(addressFields[values.delivery].map((f) => [f.name, values[f.name].trim()]));
    const newOrder = {
      number: makeOrderNumber(),
      createdAt: new Date().toISOString(),
      customer: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        middleName: values.middleName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
      },
      delivery: { method: values.delivery, ...address },
      payment: values.payment,
      paymentStatus: values.payment === 'card-online' ? 'paid' : 'unpaid',
      status: 'created',
      promo,
      items: lines.map((l) => ({ id: l.id, name: l.product.name, size: l.size, color: l.color, qty: l.qty, price: l.product.price })),
      totals,
    };
    addOrder(newOrder);
    clearCart();
    setOrder(newOrder);
  };

  const crumbs = [{ label: 'Главная', to: '/' }, { label: 'Корзина товаров', to: '/cart' }, { label: 'Оформление заказа' }];

  if (!lines.length) {
    return (
      <Container className={styles['checkout-page']}>
        <Breadcrumbs items={crumbs} />
        <PageTitle className={styles['checkout-page__title']}>Оформление заказа</PageTitle>
        {!order && <EmptyState title="Корзина пуста" text="Добавьте товары, чтобы оформить заказ." action={{ label: 'Перейти в каталог', to: '/catalog' }} />}
        <OrderSuccessModal order={order} onClose={() => setOrder(null)} />
      </Container>
    );
  }

  const fields = addressFields[values.delivery];
  const before = fields.filter((f) => f.span !== 'after');
  const after = fields.filter((f) => f.span === 'after');
  const showCard = values.payment === 'card-online' && values.system !== 'sbp';

  return (
    <Container className={styles['checkout-page']}>
      <Breadcrumbs items={crumbs} />
      <PageTitle className={styles['checkout-page__title']}>Оформление заказа</PageTitle>

      <form ref={formRef} className={styles['checkout-page__layout']} onSubmit={handleSubmit} noValidate>
        <div className={styles['checkout-page__form']}>
          <fieldset className={styles['checkout-page__block']}>
            <legend className={styles['checkout-page__heading']}>Контактная информация</legend>
            <div className={styles['checkout-page__grid']}>
              {contactFields.map((f) => (
                <FormField
                  key={f.name}
                  className={f.wide ? styles['checkout-page__cell_full'] : styles['checkout-page__cell_pair']}
                  label={f.label}
                  type={f.type || 'text'}
                  inputMode={f.inputMode}
                  autoComplete={f.autoComplete}
                  {...field(f)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className={styles['checkout-page__block']}>
            <legend className={styles['checkout-page__heading']}>Доставка</legend>
            <ul className={styles['checkout-page__options']}>
              {deliveryMethods.map((m) => (
                <li key={m.id}>
                  <Radio name="delivery" value={m.id} checked={values.delivery === m.id} onChange={(v) => setField('delivery', v)}>
                    <span className={styles['checkout-page__option']}>
                      <span>
                        <span className={styles['checkout-page__option-title']}>{m.label}</span>
                        <span className={styles['checkout-page__option-hint']}>{m.term}</span>
                      </span>
                      <span className={styles['checkout-page__option-price']}>от {formatNumber(m.price)}₽</span>
                    </span>
                  </Radio>
                </li>
              ))}
            </ul>
            <div className={cx(styles['checkout-page__grid'], styles['checkout-page__address'])}>
              {before.map((f) => (
                <FormField
                  key={`${values.delivery}-${f.name}`}
                  className={styles[`checkout-page__cell_${f.span}`]}
                  label={f.placeholder}
                  inputMode={f.inputMode}
                  {...field(f)}
                />
              ))}
              <Button
                className={cx(styles['checkout-page__map-button'], values.delivery === 'courier' && styles['checkout-page__map-button_small'])}
                onClick={() => setMapOpen(true)}
                aria-haspopup="dialog"
              >
                Выбрать на карте
              </Button>
              {after.map((f) => (
                <FormField key={f.name} className={styles['checkout-page__cell_full']} label={f.placeholder} {...field(f)} />
              ))}
            </div>
          </fieldset>

          <fieldset className={styles['checkout-page__block']}>
            <legend className={styles['checkout-page__heading']}>Оплата</legend>
            <ul className={styles['checkout-page__options']}>
              {paymentMethods.map((m) => (
                <li key={m.id}>
                  <Radio name="payment" value={m.id} checked={values.payment === m.id} onChange={(v) => setField('payment', v)}>
                    <span className={styles['checkout-page__option-title']}>{m.label}</span>
                    {m.hint && <span className={styles['checkout-page__option-hint']}>{m.hint}</span>}
                  </Radio>
                </li>
              ))}
            </ul>

            {values.payment === 'card-online' && (
              <>
                <ul className={styles['checkout-page__systems']} aria-label="Платёжная система">
                  {paymentSystems.map((s) => (
                    <li key={s.id}>
                      <Radio name="system" value={s.id} checked={values.system === s.id} onChange={(v) => setField('system', v)}>
                        <img src={asset(s.image)} alt={s.label} width={s.width} height={s.height} className={styles['checkout-page__system-logo']} />
                      </Radio>
                    </li>
                  ))}
                </ul>
                {showCard ? (
                  <div className={styles['checkout-page__grid']}>
                    {cardFields.map((f) => (
                      <FormField
                        key={f.name}
                        className={styles['checkout-page__cell_pair']}
                        label={f.label}
                        type={f.type || 'text'}
                        inputMode={f.inputMode}
                        autoComplete={f.autoComplete}
                        maxLength={f.maxLength}
                        {...field(f)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className={styles['checkout-page__hint']}>После оформления откроется оплата по QR-коду (в демо — без оплаты).</p>
                )}
                <p className={styles['checkout-page__hint']}>Учебный проект: данные карты проверяются только по формату и никуда не отправляются.</p>
              </>
            )}
          </fieldset>
        </div>

        <OrderSummary lines={lines} totals={totals} promo={promo}>
          <fieldset className={styles['checkout-page__consents']}>
            <legend className={styles['checkout-page__consents-title']}>Перед оформлением необходимо дать согласие</legend>
            {consents.map((c) => (
              <Checkbox
                key={c.id}
                checked={Boolean(values.consents[c.id])}
                invalid={Boolean(errors.consents) && !values.consents[c.id]}
                onChange={(checked) => setValues((prev) => ({ ...prev, consents: { ...prev.consents, [c.id]: checked } }))}
              >
                {c.prefix}
                <Link to={`/info/${c.id}`} target="_blank" className={styles['checkout-page__consent-link']}>
                  {c.link}
                </Link>
              </Checkbox>
            ))}
            {errors.consents && <p className={styles['checkout-page__error']}>{errors.consents}</p>}
          </fieldset>
          <Button type="submit" size="l" className={styles['checkout-page__submit']} aria-disabled={!allConsents}>
            Оформить заказ
          </Button>
          {submitted && Object.keys(errors).length > 0 && (
            <p className={styles['checkout-page__error']} role="alert">
              Проверьте выделенные поля
            </p>
          )}
        </OrderSummary>
      </form>

      <DeliveryMapModal method={values.delivery} isOpen={mapOpen} onClose={() => setMapOpen(false)} onApply={applyPoint} />
      <OrderSuccessModal order={order} onClose={() => setOrder(null)} />
    </Container>
  );
}
