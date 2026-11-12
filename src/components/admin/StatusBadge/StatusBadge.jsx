import { orderStatuses, paymentStatuses } from '../../../data/orders';
import { cx } from '../../../utils/cx';
import styles from './StatusBadge.module.css';

// Статус заказа или оплаты — жирный текст, как в макете списка заказов.
// Возврат, отмена и «Не оплачено» — цветом ошибки / вспомогательным, чтобы выделялись в списке
const tones = { returned: 'alert', cancelled: 'alert', unpaid: 'muted' };

export default function StatusBadge({ status, kind = 'order', className }) {
  const label = (kind === 'payment' ? paymentStatuses : orderStatuses)[status] || status;
  return <span className={cx(styles['status-badge'], tones[status] && styles[`status-badge_tone_${tones[status]}`], className)}>{label}</span>;
}
