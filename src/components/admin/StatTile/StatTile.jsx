import { cx } from '../../../utils/cx';
import styles from './StatTile.module.css';

// Итог под графиком: подпись и число (макет: «Оформлено 607»). Используется внутри <dl>
export default function StatTile({ label, value, className }) {
  return (
    <div className={cx(styles['stat-tile'], className)}>
      <dt className={styles['stat-tile__label']}>{label}</dt>
      <dd className={styles['stat-tile__value']}>{value}</dd>
    </div>
  );
}
