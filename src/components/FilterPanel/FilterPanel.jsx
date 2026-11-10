import { useEffect, useId, useState } from 'react';
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import PriceRange from '../PriceRange/PriceRange';
import { categories, colors, genders, sizes } from '../../data/categories';
import { PRICE_MAX, PRICE_MIN, emptyFilters } from '../../utils/catalog';
import { cx } from '../../utils/cx';
import styles from './FilterPanel.module.css';

const VISIBLE = 4;

// Группа чекбоксов; длинный список сворачивается: «… еще» / «… свернуть» (макет filters)
function FilterGroup({ title, options, selected, onToggle, collapsible = false }) {
  const [expanded, setExpanded] = useState(false);
  const titleId = useId();
  const listId = useId();
  const canCollapse = collapsible && options.length > VISIBLE;
  const shown = canCollapse && !expanded ? options.slice(0, VISIBLE) : options;

  return (
    <fieldset className={styles['filter-panel__group']} aria-labelledby={titleId}>
      <legend id={titleId} className={styles['filter-panel__subtitle']}>
        {title}
      </legend>
      <ul id={listId} className={cx(styles['filter-panel__list'], expanded && styles['filter-panel__list_scroll'])}>
        {shown.map((option) => (
          <li key={option.id}>
            <Checkbox checked={selected.includes(option.id)} onChange={() => onToggle(option.id)}>
              {option.name}
            </Checkbox>
          </li>
        ))}
      </ul>
      {canCollapse && (
        <button
          type="button"
          className={styles['filter-panel__more']}
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? '… свернуть' : '… еще'}
        </button>
      )}
    </fieldset>
  );
}

// Панель фильтров: изменения копятся в черновике и применяются кнопкой «Применить»
// hideTitle — в выезжающей панели заголовок уже есть в её шапке
export default function FilterPanel({ value, onApply, hideTitle = false, className }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const toggle = (key) => (id) =>
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id],
    }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(draft);
  };

  const handleReset = () => {
    const cleared = { ...emptyFilters(), q: value.q, sort: value.sort };
    setDraft(cleared);
    onApply(cleared);
  };

  return (
    <form className={cx(styles['filter-panel'], className)} onSubmit={handleSubmit} aria-labelledby="filters-title">
      <h2 id="filters-title" className={hideTitle ? 'visually-hidden' : styles['filter-panel__title']}>
        Фильтры
      </h2>

      <fieldset className={styles['filter-panel__group']}>
        <legend className={styles['filter-panel__subtitle']}>Цена</legend>
        <PriceRange
          min={PRICE_MIN}
          max={PRICE_MAX}
          from={draft.min}
          to={draft.max}
          onChange={(min, max) => setDraft((prev) => ({ ...prev, min, max }))}
        />
      </fieldset>

      <FilterGroup title="Категория товара" options={categories} selected={draft.category} onToggle={toggle('category')} />
      <FilterGroup title="Пол" options={genders} selected={draft.gender} onToggle={toggle('gender')} />
      <FilterGroup title="Размер" options={sizes} selected={draft.size} onToggle={toggle('size')} collapsible />
      <FilterGroup title="Цвет" options={colors} selected={draft.color} onToggle={toggle('color')} collapsible />

      <div className={styles['filter-panel__actions']}>
        <Button type="submit" className={styles['filter-panel__button']}>
          Применить
        </Button>
        <Button variant="secondary" className={cx(styles['filter-panel__button'], styles['filter-panel__button_reset'])} onClick={handleReset}>
          Очистить фильтры
        </Button>
      </div>
    </form>
  );
}
