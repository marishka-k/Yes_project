import { useEffect, useId, useState } from 'react';
import Modal from '../../Modal/Modal';
import FormField from '../../FormField/FormField';
import Button from '../../Button/Button';
import styles from './AddOptionModal.module.css';

// Новое значение справочника по кнопке «+» в форме товара (категория, коллекция, состав, цвет, размер).
// Для цвета дополнительно выбирается оттенок кружка. existing — уже занятые названия
export default function AddOptionModal({ isOpen, title, withColor = false, existing = [], onAdd, onClose }) {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#e3a874');
  const [error, setError] = useState('');
  const colorId = useId();

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = name.trim();
    if (!value) return setError('Введите название');
    if (existing.some((x) => x.toLowerCase() === value.toLowerCase())) return setError('Такое значение уже есть');
    onAdd(withColor ? { name: value, hex } : value);
    return undefined;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form className={styles['add-option']} onSubmit={handleSubmit} noValidate>
        <FormField label="Название" hideLabel={false} value={name} onChange={(e) => setName(e.target.value)} error={error} autoComplete="off" />
        {withColor && (
          <div className={styles['add-option__color']}>
            <label htmlFor={colorId}>Цвет кружка в карточке</label>
            <input id={colorId} className={styles['add-option__picker']} type="color" value={hex} onChange={(e) => setHex(e.target.value)} />
          </div>
        )}
        <div className={styles['add-option__actions']}>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">Добавить</Button>
        </div>
      </form>
    </Modal>
  );
}
