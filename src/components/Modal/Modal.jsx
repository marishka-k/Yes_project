import { useId } from 'react';
import { createPortal } from 'react-dom';
import useDialog from '../../hooks/useDialog';
import Icon from '../Icon/Icon';
import { cx } from '../../utils/cx';
import styles from './Modal.module.css';

// Модальное окно: фокус внутри, Escape и клик по фону закрывают.
// size: m — окно «Спасибо!» (666 px), l — окна выбора на карте (1000 px)
export default function Modal({ isOpen, onClose, title, size = 'm', className, children }) {
  const ref = useDialog(isOpen, onClose);
  const titleId = useId();
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modal} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={ref}
        className={cx(styles.modal__dialog, styles[`modal__dialog_size_${size}`], className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button type="button" className={styles.modal__close} onClick={onClose} aria-label="Закрыть">
          <Icon name="close" width={24} />
        </button>
        <h2 id={titleId} className={styles.modal__title}>
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  );
}
