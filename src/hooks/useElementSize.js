import { useEffect, useRef, useState } from 'react';

// Размер элемента в пикселях (ширина и высота), обновляется при изменении размера.
// Нужен графику: он рисуется в настоящих пикселях, чтобы подписи не уменьшались вместе с viewBox
export default function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const update = () => setSize({ width: element.clientWidth, height: element.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}
