import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import styles from './EmptyState.module.css';

// Пустое состояние: пустая корзина, нет избранного, ничего не найдено
export default function EmptyState({ icon = 'cart', title, text, action }) {
  return (
    <div className={styles['empty-state']}>
      <Icon name={icon} width={48} className={styles['empty-state__icon']} />
      <h2 className={styles['empty-state__title']}>{title}</h2>
      {text && <p className={styles['empty-state__text']}>{text}</p>}
      {action && (
        <Button to={action.to} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
