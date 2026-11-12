import { useEffect, useRef, useState } from 'react';
import Checkbox from '../../Checkbox/Checkbox';
import Icon from '../../Icon/Icon';
import { cx } from '../../../utils/cx';
import styles from './ScrollList.module.css';

const STEP = 40;

// Список с чекбоксами и полосой прокрутки из UI Kit (стрелки вверх/вниз и ползунок):
// «Цвета в наличии» и «Размеры в наличии» в форме товара. Колесо и клавиатура работают как обычно.
// options — [{ id, name }], selected — массив id, onAdd — кнопка «+» (новое значение)
export default function ScrollList({ title, options, selected, onToggle, onAdd, addLabel, error, className }) {
  const listRef = useRef(null);
  const [scroll, setScroll] = useState({ ratio: 0, visible: 1 });

  const update = () => {
    const el = listRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScroll({ ratio: max > 0 ? el.scrollTop / max : 0, visible: el.scrollHeight ? el.clientHeight / el.scrollHeight : 1 });
  };

  useEffect(update, [options.length]);

  const scrollBy = (dir) => listRef.current?.scrollBy({ top: dir * STEP, behavior: 'smooth' });
  const scrollable = scroll.visible < 1;

  return (
    <fieldset className={cx(styles['scroll-list'], className)} aria-invalid={error ? 'true' : undefined}>
      <legend className={styles['scroll-list__title']}>{title}</legend>
      {onAdd && (
        <button type="button" className={styles['scroll-list__add']} onClick={onAdd} aria-label={addLabel}>
          <Icon name="plus" width={24} />
        </button>
      )}
      <div className={styles['scroll-list__box']}>
        <ul ref={listRef} className={styles['scroll-list__list']} onScroll={update}>
          {options.map((o) => (
            <li key={o.id}>
              <Checkbox checked={selected.includes(o.id)} onChange={() => onToggle(o.id)}>
                {o.name}
              </Checkbox>
            </li>
          ))}
        </ul>
        <div className={cx(styles['scroll-list__rail'], !scrollable && styles['scroll-list__rail_idle'])} aria-hidden="true">
          <button type="button" tabIndex={-1} className={styles['scroll-list__step']} onClick={() => scrollBy(-1)}>
            <Icon name="arrow" width={11} />
          </button>
          <span className={styles['scroll-list__track']}>
            <span
              className={styles['scroll-list__thumb']}
              style={{ top: `${scroll.ratio * 100}%`, transform: `translateY(-${scroll.ratio * 100}%)` }}
            />
          </span>
          <button type="button" tabIndex={-1} className={cx(styles['scroll-list__step'], styles['scroll-list__step_down'])} onClick={() => scrollBy(1)}>
            <Icon name="arrow" width={11} />
          </button>
        </div>
      </div>
      {error && <p className={styles['scroll-list__error']}>{error}</p>}
    </fieldset>
  );
}
