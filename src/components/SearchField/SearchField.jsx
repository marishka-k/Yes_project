import { useEffect, useId, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../Icon/Icon';
import { cx } from '../../utils/cx';
import styles from './SearchField.module.css';

// Поиск из шапки: отправка ведёт в каталог с параметром ?q=.
// С onChange — управляемое поле без перехода (поиск в списках админки)
export default function SearchField({ className, onSearch, value: outerValue, onChange, label = 'Поиск по каталогу' }) {
  const controlled = typeof onChange === 'function';
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [value, setValue] = useState('');
  const id = useId();

  // В каталоге поле показывает текущий запрос
  useEffect(() => {
    setValue(pathname === '/catalog' ? params.get('q') || '' : '');
  }, [pathname, params]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (controlled) return;
    const next = new URLSearchParams(pathname === '/catalog' ? params : undefined);
    if (value.trim()) next.set('q', value.trim());
    else next.delete('q');
    navigate(`/catalog${next.toString() ? `?${next}` : ''}`);
    onSearch?.();
  };

  return (
    <form className={cx(styles['search-field'], className)} role="search" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={styles['search-field__input']}
        type="search"
        placeholder="Поиск"
        value={controlled ? outerValue : value}
        onChange={(event) => (controlled ? onChange(event.target.value) : setValue(event.target.value))}
        autoComplete="off"
      />
      <button className={styles['search-field__button']} type="submit" aria-label="Найти">
        <Icon name="search" width={20} />
      </button>
    </form>
  );
}
