import Modal from '../../Modal/Modal';
import Button from '../../Button/Button';
import styles from './ConfirmModal.module.css';

// Подтверждение действия (удалить товар, сбросить данные): окно Modal с двумя кнопками
export default function ConfirmModal({ isOpen, title, text, confirmLabel = 'Удалить', onConfirm, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {text && <p className={styles['confirm-modal__text']}>{text}</p>}
      <div className={styles['confirm-modal__actions']}>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
