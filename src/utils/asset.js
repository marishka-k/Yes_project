// Путь к файлу из public/ с учётом base (сайт открывается из подпапки)
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

// Фото товара из public/images/products
export const productPhoto = (file) => asset(`images/products/${file}`);

// Крупная версия фото для страницы товара (если её нет — обычная)
export const productPhotoLarge = (product, file) =>
  productPhoto(product.large ? file.replace(/\.webp$/, '-l.webp') : file);
