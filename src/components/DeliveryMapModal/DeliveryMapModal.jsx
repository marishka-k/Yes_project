import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { deliveryMaps } from '../../data/delivery';
import { asset } from '../../utils/asset';
import { cx } from '../../utils/cx';
import styles from './DeliveryMapModal.module.css';

// Окна «Выбор пункта выдачи СДЭК», «Почта России», «курьером» (макеты SDEK, Russian post, courier delivery).
// Карта — статичная картинка из макета, точки и список справа — настоящие кнопки (демо без API карт)
export default function DeliveryMapModal({ method, isOpen, onClose, onApply }) {
  const map = deliveryMaps[method];
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (isOpen) setSelected(null);
  }, [isOpen, method]);

  if (!map) return null;
  const point = map.points.find((p) => p.id === selected);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={map.title} size="l">
      <div className={styles['delivery-map']}>
        <div className={styles['delivery-map__map']}>
          <img className={styles['delivery-map__image']} src={asset(map.image)} alt="Карта Москвы" width="938" height="430" />
          {map.points.map((p) => (
            <button
              key={p.id}
              type="button"
              className={cx(styles['delivery-map__pin'], p.id === selected && styles['delivery-map__pin_active'])}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => setSelected(p.id)}
              aria-label={`${p.title}: ${p.address}`}
              aria-pressed={p.id === selected}
            />
          ))}
        </div>

        <div className={styles['delivery-map__side']}>
          <h3 className={styles['delivery-map__list-title']}>{map.listTitle}</h3>
          <ul className={styles['delivery-map__list']}>
            {map.points.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={cx(styles['delivery-map__point'], p.id === selected && styles['delivery-map__point_active'])}
                  onClick={() => setSelected(p.id)}
                  aria-pressed={p.id === selected}
                >
                  <span className={styles['delivery-map__point-title']}>{p.title}</span>
                  <span>{p.address}</span>
                  {p.hours && <span className={styles['delivery-map__hours']}>{p.hours}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles['delivery-map__footer']}>
        <p className={styles['delivery-map__chosen']} aria-live="polite">
          {point ? `Выбрано: ${point.address}` : 'Выберите точку на карте или в списке'}
        </p>
        <Button className={styles['delivery-map__apply']} disabled={!point} onClick={() => onApply(point)}>
          Применить
        </Button>
      </div>
    </Modal>
  );
}
