// Проверка формы оформления заказа. Возвращает объект { поле: текст ошибки }
import { addressFields } from '../data/delivery';
import { consents } from '../data/checkout';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[A-Za-zА-Яа-яЁё\s-]{2,}$/;
const LATIN_RE = /^[A-Za-z\s-]{2,}$/;

export function validateCheckout(values) {
  const errors = {};
  const phoneDigits = values.phone.replace(/\D/g, '');

  if (!values.firstName.trim()) errors.firstName = 'Введите имя';
  else if (!NAME_RE.test(values.firstName.trim())) errors.firstName = 'Только буквы';
  if (!values.lastName.trim()) errors.lastName = 'Введите фамилию';
  else if (!NAME_RE.test(values.lastName.trim())) errors.lastName = 'Только буквы';
  if (values.middleName.trim() && !NAME_RE.test(values.middleName.trim())) errors.middleName = 'Только буквы';

  if (!values.phone.trim()) errors.phone = 'Введите телефон';
  else if (/[^\d\s()+-]/.test(values.phone) || phoneDigits.length < 10 || phoneDigits.length > 11) {
    errors.phone = 'Например: +7 900 000-00-00';
  }
  if (!values.email.trim()) errors.email = 'Введите e-mail';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Проверьте e-mail';

  addressFields[values.delivery].forEach((field) => {
    if (field.required && !values[field.name].trim()) errors[field.name] = `Заполните: ${field.label.toLowerCase()}`;
  });
  if (values.delivery === 'post' && values.index.trim() && !/^\d{6}$/.test(values.index.trim())) {
    errors.index = 'Индекс — 6 цифр';
  }

  // Поля карты проверяются только по формату и нигде не сохраняются
  if (values.payment === 'card-online' && values.system !== 'sbp') {
    if (!/^\d{16}$/.test(values.cardNumber.replace(/\s/g, ''))) errors.cardNumber = 'Нужно 16 цифр';
    if (!LATIN_RE.test(values.cardHolder.trim())) errors.cardHolder = 'Латиницей, как на карте';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.cardExpiry.trim())) errors.cardExpiry = 'Формат ММ/ГГ';
    if (!/^\d{3}$/.test(values.cardCvv.trim())) errors.cardCvv = 'Нужно 3 цифры';
  }

  if (consents.some((c) => !values.consents[c.id])) errors.consents = 'Нужно дать все согласия';
  return errors;
}
