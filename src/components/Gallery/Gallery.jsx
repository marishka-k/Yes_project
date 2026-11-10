import { useState } from 'react';
import Icon from '../Icon/Icon';
import { productPhoto, productPhotoLarge } from '../../utils/asset';
import { cx } from '../../utils/cx';
import styles from './Gallery.module.css';

// Галерея товара: колонка миниатюр со стрелками (на телефоне — строка под фото) и большое фото
export default function Gallery({ product }) {
  const { images, name } = product;
  const [active, setActive] = useState(0);
  const count = images.length;
  const go = (step) => setActive((index) => (index + step + count) % count);

  return (
    <div className={styles.gallery}>
      <div className={styles.gallery__thumbs}>
        <button type="button" className={styles.gallery__arrow} onClick={() => go(-1)} disabled={count < 2} aria-label="Предыдущее фото">
          <Icon name="arrow" width={15} className={styles['gallery__arrow-icon']} />
        </button>
        <ul className={styles.gallery__list}>
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                className={cx(styles.gallery__thumb, index === active && styles.gallery__thumb_active)}
                onClick={() => setActive(index)}
                aria-label={`Фото ${index + 1} из ${count}`}
                aria-pressed={index === active}
              >
                <img src={productPhoto(image)} alt="" width="70" height="88" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className={styles.gallery__arrow} onClick={() => go(1)} disabled={count < 2} aria-label="Следующее фото">
          <Icon name="arrow" width={15} className={cx(styles['gallery__arrow-icon'], styles['gallery__arrow-icon_down'])} />
        </button>
      </div>
      <div className={styles.gallery__main}>
        <img
          className={styles.gallery__image}
          src={productPhotoLarge(product, images[active])}
          alt={`${name}, фото ${active + 1}`}
          width="620"
          height="692"
        />
      </div>
    </div>
  );
}
