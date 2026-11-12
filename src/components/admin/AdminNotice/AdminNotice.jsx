import Icon from '../../Icon/Icon';
import styles from './AdminNotice.module.css';

// Сообщение о результате действия («Товар создан», «Статус изменён»); читается экранными читалками
export default function AdminNotice({ children, onClose }) {
  return (
    <div className={styles['admin-notice']} role="status">
      <p className={styles['admin-notice__text']}>{children}</p>
      {onClose && (
        <button type="button" className={styles['admin-notice__close']} onClick={onClose} aria-label="Скрыть сообщение">
          <Icon name="close" width={16} />
        </button>
      )}
    </div>
  );
}
