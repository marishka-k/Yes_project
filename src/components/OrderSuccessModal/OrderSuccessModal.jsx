import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import styles from './OrderSuccessModal.module.css';

// Окно «Спасибо!» после оформления (макет Confim order registration)
export default function OrderSuccessModal({ order, onClose }) {
  const navigate = useNavigate();
  const goHome = () => {
    onClose();
    navigate('/');
  };

  return (
    <Modal isOpen={Boolean(order)} onClose={goHome} title="Спасибо!" size="m" className={styles['order-success']}>
      {order && (
        <>
          <p className={styles['order-success__number']}>Ваш заказ № {order.number} оформлен</p>
          <p className={styles['order-success__text']}>Отследить доставку Вы можете в личном кабинете в разделе «Заказы»</p>
          <Button className={styles['order-success__button']} onClick={goHome}>
            Перейти на главную страницу
          </Button>
        </>
      )}
    </Modal>
  );
}
