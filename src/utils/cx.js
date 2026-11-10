// Склеивает классы, пропуская пустые значения
export const cx = (...classes) => classes.filter(Boolean).join(' ');
