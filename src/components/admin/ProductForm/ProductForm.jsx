import { useRef, useState } from 'react';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';
import Button from '../../Button/Button';
import Icon from '../../Icon/Icon';
import ScrollList from '../ScrollList/ScrollList';
import ProductPhotos from '../ProductPhotos/ProductPhotos';
import AddOptionModal from '../AddOptionModal/AddOptionModal';
import { useCatalog } from '../../../store/CatalogContext';
import { categories, colors, sizes } from '../../../data/categories';
import { collections, compositions, genderOptions, linings, seasons } from '../../../data/productOptions';
import { validateProduct } from '../../../utils/productForm';
import { cx } from '../../../utils/cx';
import styles from './ProductForm.module.css';

const toOptions = (list) => list.map((value) => ({ id: value, name: value }));

// Что добавляет «+» у каждого справочника: ключ в CatalogContext, поле формы, заголовок окна
const addable = {
  category: { kind: 'categories', title: 'Новая категория', names: () => categories.map((c) => c.name) },
  collection: { kind: 'collections', title: 'Новая коллекция', names: () => collections },
  composition: { kind: 'compositions', title: 'Новый состав', names: () => compositions },
  lining: { kind: 'linings', title: 'Новый состав подкладки', names: () => linings },
  colors: { kind: 'colors', title: 'Новый цвет', names: () => colors.map((c) => c.name), withColor: true },
  sizes: { kind: 'sizes', title: 'Новый размер', names: () => sizes.map((s) => s.name) },
};

// Форма «Добавить товар» / «Изменить товар» по макетам: фото слева, поля справа,
// списки цветов и размеров с прокруткой, кнопки сброса и сохранения.
// initial — значения полей, mode: create | edit, onSubmit(values) — после успешной проверки
export default function ProductForm({ initial, mode = 'create', productId, onSubmit }) {
  const { allProducts, addDictionaryValue } = useCatalog();
  const [values, setValues] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [adding, setAdding] = useState(null);
  const formRef = useRef(null);

  const errors = submitted ? validateProduct(values, allProducts, productId) : {};
  const set = (name) => (value) => setValues((prev) => ({ ...prev, [name]: value }));
  const input = (name) => ({ name, value: values[name], onChange: (e) => set(name)(e.target.value), error: errors[name] });
  const select = (name) => ({ value: values[name], onChange: set(name), error: errors[name] });
  const toggle = (name) => (id) =>
    setValues((prev) => ({ ...prev, [name]: prev[name].includes(id) ? prev[name].filter((x) => x !== id) : [...prev[name], id] }));

  const handleAdd = (value) => {
    const { kind } = addable[adding];
    const id = addDictionaryValue(kind, value);
    if (adding === 'colors' || adding === 'sizes') setValues((prev) => ({ ...prev, [adding]: [...prev[adding], id] }));
    else set(adding)(id);
    setAdding(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validateProduct(values, allProducts, productId);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    onSubmit(values);
  };

  const reset = () => {
    setValues(initial);
    setSubmitted(false);
  };

  const plus = (name, label) => (
    <button type="button" className={styles['product-form__plus']} onClick={() => setAdding(name)} aria-label={label}>
      <Icon name="plus" width={24} />
    </button>
  );

  return (
    <form ref={formRef} className={cx(styles['product-form'], styles[`product-form_mode_${mode}`])} onSubmit={handleSubmit} noValidate>
      <ProductPhotos images={values.images} onChange={set('images')} error={errors.images} />

      <div className={styles['product-form__fields']}>
        <FormField layout="row" className={styles['product-form__article']} label="Артикул" inputMode="numeric" autoComplete="off" {...input('article')} />
        <FormField layout="row" className={styles['product-form__wide']} label="Название" placeholder="Название товара" autoComplete="off" {...input('name')} />

        <div className={styles['product-form__line']}>
          <Select layout="row" className={styles['product-form__long']} label="Категория" placeholder="Категория товара" options={categories} {...select('category')} />
          {plus('category', 'Добавить категорию')}
        </div>
        <Select layout="row" className={styles['product-form__short']} label="Сезон" placeholder="Сезон" options={toOptions(seasons)} {...select('season')} />
        <div className={styles['product-form__line']}>
          <Select layout="row" className={styles['product-form__long']} label="Коллекция" placeholder="Коллекция" options={toOptions(collections)} {...select('collection')} />
          {plus('collection', 'Добавить коллекцию')}
        </div>
        <div className={styles['product-form__line']}>
          <Select layout="row" className={styles['product-form__long']} label="Состав" placeholder="Состав" options={toOptions(compositions)} {...select('composition')} />
          {plus('composition', 'Добавить состав')}
        </div>
        <div className={styles['product-form__line']}>
          <Select layout="row" className={styles['product-form__long']} label="Состав подкладки" placeholder="Состав подкладки" options={toOptions(linings)} {...select('lining')} />
          {plus('lining', 'Добавить состав подкладки')}
        </div>
        <Select layout="row" className={styles['product-form__short']} label="Пол" placeholder="Пол" options={genderOptions} {...select('gender')} />

        <div className={styles['product-form__prices']}>
          <FormField layout="row" className={styles['product-form__short']} label="Цена" placeholder="Цена, ₽" inputMode="numeric" autoComplete="off" {...input('price')} />
          <FormField layout="row" className={styles['product-form__short']} label="Скидка" placeholder="Скидка, ₽" inputMode="numeric" autoComplete="off" {...input('discount')} />
        </div>

        <FormField className={styles['product-form__description']} label="Описание" multiline rows={3} {...input('description')} />

        <div className={styles['product-form__lists']}>
          <ScrollList
            title="Цвета в наличии"
            options={colors}
            selected={values.colors}
            onToggle={toggle('colors')}
            onAdd={() => setAdding('colors')}
            addLabel="Добавить цвет"
            error={errors.colors}
          />
          <ScrollList
            title="Размеры в наличии"
            options={sizes}
            selected={values.sizes}
            onToggle={toggle('sizes')}
            onAdd={() => setAdding('sizes')}
            addLabel="Добавить размер"
          />
        </div>
      </div>

      <div className={styles['product-form__actions']}>
        <Button variant="secondary" onClick={reset}>
          {mode === 'edit' ? 'Отменить изменения' : 'Очистить форму'}
        </Button>
        <Button type="submit">{mode === 'edit' ? 'Изменить товар' : 'Создать товар'}</Button>
      </div>

      <AddOptionModal
        isOpen={Boolean(adding)}
        title={adding ? addable[adding].title : ''}
        withColor={adding === 'colors'}
        existing={adding ? addable[adding].names() : []}
        onAdd={handleAdd}
        onClose={() => setAdding(null)}
      />
    </form>
  );
}
