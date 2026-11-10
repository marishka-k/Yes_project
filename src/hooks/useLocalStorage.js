import { useEffect, useState } from 'react';

// Состояние, которое сохраняется в localStorage под ключом key
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved === null ? initialValue : JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // приватный режим или переполнение — работаем без сохранения
    }
  }, [key, value]);

  return [value, setValue];
}
