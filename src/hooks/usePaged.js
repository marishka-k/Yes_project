import { useEffect, useState } from 'react';

// Постраничный вывод списка: при смене фильтра (resetKey) — снова первая страница,
// если список стал короче — последняя доступная
export default function usePaged(list, perPage, resetKey) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(list.length / perPage));

  useEffect(() => setPage(1), [resetKey]);

  const current = Math.min(page, pages);
  return {
    page: current,
    pages,
    setPage,
    items: list.slice((current - 1) * perPage, current * perPage),
  };
}
