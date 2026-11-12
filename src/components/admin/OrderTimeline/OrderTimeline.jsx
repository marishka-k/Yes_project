import Icon from '../../Icon/Icon';
import { deliverySteps, orderStatuses } from '../../../data/orders';
import { cx } from '../../../utils/cx';
import styles from './OrderTimeline.module.css';

// Шкала «Детали доставки» из макета order info: пройденные шаги — акцентом с галочкой,
// будущие — пустым кружком, между шагами — сплошная или пунктирная линия.
// Возврат и отмена добавляются последним шагом цветом ошибки
export default function OrderTimeline({ status }) {
  const extra = status === 'returned' || status === 'cancelled' ? status : null;
  const current = extra === 'returned' ? deliverySteps.length - 1 : extra === 'cancelled' ? 0 : deliverySteps.indexOf(status);
  const steps = extra ? [...deliverySteps.slice(0, current + 1), extra] : deliverySteps;

  return (
    <ol className={styles['order-timeline']}>
      {steps.map((step, i) => {
        const done = i <= current || step === extra;
        // Участок линии до следующего шага сплошной, если следующий шаг уже пройден
        const passed = i < steps.length - 1 && (i + 1 <= current || steps[i + 1] === extra);
        return (
          <li
            key={step}
            className={cx(
              styles['order-timeline__step'],
              done && styles['order-timeline__step_done'],
              step === extra && styles['order-timeline__step_alert'],
              passed && styles['order-timeline__step_passed'],
            )}
            aria-current={(extra ? step === extra : i === current) ? 'step' : undefined}
          >
            <span className={styles['order-timeline__mark']} aria-hidden="true">
              {done && <Icon name={step === extra ? 'close' : 'check'} width={step === extra ? 14 : 22} />}
            </span>
            <span className={styles['order-timeline__label']}>{orderStatuses[step]}</span>
            <span className="visually-hidden">{done ? ' — пройдено' : ' — впереди'}</span>
          </li>
        );
      })}
    </ol>
  );
}
