import { useState } from 'react';
import Icon from '../../Icon/Icon';
import IconButton from '../IconButton/IconButton';
import ImagePicker from '../ImagePicker/ImagePicker';
import { productPhoto } from '../../../utils/asset';
import { cx } from '../../../utils/cx';
import styles from './ProductPhotos.module.css';

// Фото товара в форме (макеты Create item / Edit item): основное фото с карандашом и корзиной,
// миниатюры с корзиной (нажатие делает фото основным) и плитка «+».
// images — имена файлов; первое — основное (оно же в карточке каталога)
export default function ProductPhotos({ images, onChange, error }) {
  const [picker, setPicker] = useState(null); // null | 'add' | 'replace'
  const [main, ...rest] = images;

  const pick = (file) => {
    onChange(picker === 'replace' && main ? [file, ...rest] : [...images, file]);
    setPicker(null);
  };
  const remove = (file) => onChange(images.filter((f) => f !== file));
  const makeMain = (file) => onChange([file, ...images.filter((f) => f !== file)]);

  return (
    <div className={styles['product-photos']}>
      {main ? (
        <div className={styles['product-photos__main']}>
          <img className={styles['product-photos__image']} src={productPhoto(main)} alt="Основное фото товара" />
          <div className={styles['product-photos__tools']}>
            <IconButton icon="pencil" label="Заменить основное фото" onClick={() => setPicker('replace')} />
            <IconButton icon="trash" iconWidth={18} label="Удалить основное фото" onClick={() => remove(main)} />
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={cx(styles['product-photos__upload'], error && styles['product-photos__upload_invalid'])}
          onClick={() => setPicker('add')}
          aria-invalid={error ? 'true' : undefined}
        >
          <span className={styles['product-photos__upload-text']}>Загрузить основное изображение товара</span>
          <Icon name="plus" width={72} className={styles['product-photos__plus']} />
        </button>
      )}

      <ul className={styles['product-photos__thumbs']}>
        {rest.map((file) => (
          <li key={file} className={styles['product-photos__thumb']}>
            <button type="button" className={styles['product-photos__thumb-button']} onClick={() => makeMain(file)} aria-label="Сделать фото основным">
              <img src={productPhoto(file)} alt="" loading="lazy" />
            </button>
            <IconButton className={styles['product-photos__thumb-remove']} icon="trash" iconWidth={14} label="Удалить фото" onClick={() => remove(file)} />
          </li>
        ))}
        <li>
          <button type="button" className={styles['product-photos__add']} onClick={() => setPicker('add')} aria-label="Добавить фото">
            <Icon name="plus" width={40} />
          </button>
        </li>
      </ul>
      {error && <p className={styles['product-photos__error']}>{error}</p>}
      <p className={styles['product-photos__note']}>Фото выбираются из уже загруженных на сайт.</p>

      <ImagePicker isOpen={Boolean(picker)} onClose={() => setPicker(null)} onPick={pick} used={images} />
    </div>
  );
}
