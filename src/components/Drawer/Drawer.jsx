import { useId } from 'react';
import { createPortal } from 'react-dom';
import useDialog from '../../hooks/useDialog';
import Icon from '../Icon/Icon';
import { cx } from '../../utils/cx';
import styles from './Drawer.module.css';

// Выезжающая панель для мобильной версии (меню и фильтры)
export default function Drawer({ isOpen, onClose, title, side = 'left', children }) {
  const ref = useDialog(isOpen, onClose);
  const titleId = useId();
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.drawer} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={ref}
        className={cx(styles.drawer__panel, styles[`drawer__panel_side_${side}`])}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.drawer__head}>
          <h2 id={titleId} className={styles.drawer__title}>
            {title}
          </h2>
          <button type="button" className={styles.drawer__close} onClick={onClose} aria-label="Закрыть">
            <Icon name="close" width={20} />
          </button>
        </div>
        <div className={styles.drawer__body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
