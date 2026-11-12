import Modal from '../../Modal/Modal';
import { productImages } from '../../../data/productOptions';
import { productPhoto } from '../../../utils/asset';
import { cx } from '../../../utils/cx';
import styles from './ImagePicker.module.css';

// Выбор фото товара из картинок, которые уже есть на сайте (public/images/products).
// Загрузки файлов нет: сайт статический, а localStorage не подходит для хранения фото
export default function ImagePicker({ isOpen, onClose, onPick, used = [] }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Выберите фото" size="l">
      <p className={styles['image-picker__note']}>Демо: фото выбираются из уже загруженных на сайт. Отмеченные уже есть у товара.</p>
      <ul className={styles['image-picker__grid']}>
        {productImages.map((file) => {
          const isUsed = used.includes(file);
          return (
            <li key={file}>
              <button
                type="button"
                className={cx(styles['image-picker__item'], isUsed && styles['image-picker__item_used'])}
                onClick={() => onPick(file)}
                disabled={isUsed}
                aria-label={`Фото ${file}${isUsed ? ' — уже добавлено' : ''}`}
              >
                <img src={productPhoto(file)} alt="" loading="lazy" width="120" height="150" />
              </button>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
