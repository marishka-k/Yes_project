import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Общее поведение модалок и выезжающих панелей:
// блокирует прокрутку страницы, закрывает по Escape, переносит фокус внутрь,
// не выпускает его по Tab и возвращает на кнопку, которая открыла окно
export default function useDialog(isOpen, onClose) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    const opener = document.activeElement;
    document.body.classList.add('scroll-locked');
    ref.current?.focus();

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab' || !ref.current) return;
      const nodes = ref.current.querySelectorAll(FOCUSABLE);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.classList.remove('scroll-locked');
      opener?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  return ref;
}
