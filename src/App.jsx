import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import ProductPage from './pages/ProductPage/ProductPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import DeliveryPage from './pages/DeliveryPage/DeliveryPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import InfoPage from './pages/InfoPage/InfoPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import styles from './App.module.css';

// Этап 1 — витрина. Этап 2 добавит раздел админки (/admin: аналитика, товары, заказы)
// отдельными страницами в src/pages/admin и маршрутами здесь же; данные заказов уже копятся в store (orders)
export default function App() {
  const { pathname } = useLocation();

  // При переходе между страницами — наверх
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.app}>
      {/* Не ссылка #main: с HashRouter она сменила бы маршрут */}
      <button type="button" className={styles.app__skip} onClick={() => document.getElementById('main')?.focus()}>
        К содержимому
      </button>
      <Header />
      <main className={styles.app__main} id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/info/:slug" element={<InfoPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
