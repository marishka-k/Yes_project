import Icon from '../Icon/Icon';
import { useStore } from '../../store/StoreContext';
import { cx } from '../../utils/cx';
import styles from './FavoriteButton.module.css';

// Сердечко «в избранное»: пустое — светлое, выбранное — акцентное (как в UI Kit).
// variant: overlay — поверх фото карточки, boxed — квадратная кнопка рядом с «В корзину»
export default function FavoriteButton({ id, name, variant = 'overlay', className }) {
  const { favorites, toggleFavorite } = useStore();
  const active = favorites.includes(id);
  return (
    <button
      type="button"
      className={cx(
        styles['favorite-button'],
        styles[`favorite-button_variant_${variant}`],
        active && styles['favorite-button_active'],
        className,
      )}
      aria-pressed={active}
      aria-label={active ? `Убрать «${name}» из избранного` : `Добавить «${name}» в избранное`}
      onClick={() => toggleFavorite(id)}
    >
      <Icon name="heart" width={variant === 'boxed' ? 30 : 31} />
    </button>
  );
}
