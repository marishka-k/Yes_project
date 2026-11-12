import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import SiteLayout from './components/SiteLayout/SiteLayout';
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

// Админка (этап 2) — отдельный чанк: витрина не загружает её код и демо-заказы
const AdminApp = lazy(() => import('./pages/admin/AdminApp'));

export default function App() {
  const { pathname } = useLocation();

  // При переходе между страницами — наверх
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route element={<SiteLayout />}>
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
      </Route>
    </Routes>
  );
}
