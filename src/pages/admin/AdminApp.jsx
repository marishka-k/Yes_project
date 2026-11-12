import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminProvider } from '../../store/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout/AdminLayout';
import AdminPage from '../../components/admin/AdminPage/AdminPage';
import EmptyState from '../../components/EmptyState/EmptyState';
import SalesPage from './SalesPage/SalesPage';
import ProductsPage from './ProductsPage/ProductsPage';
import ProductEditPage from './ProductEditPage/ProductEditPage';
import OrdersPage from './OrdersPage/OrdersPage';
import OrderPage from './OrderPage/OrderPage';
import UsersPage from './UsersPage/UsersPage';
import SettingsPage from './SettingsPage/SettingsPage';

// Админка (этап 2): маршруты внутри /admin. Без авторизации — учебный демо-режим
export default function AdminApp() {
  return (
    <AdminProvider>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<SalesPage />} />
          <Route path="products" element={<ProductsPage key="active" />} />
          <Route path="products/archive" element={<ProductsPage key="archive" archived />} />
          <Route path="products/new" element={<ProductEditPage key="new" />} />
          <Route path="products/:id/edit" element={<ProductEditPage key="edit" />} />
          <Route path="orders" element={<Navigate to="active" replace />} />
          <Route path="orders/:group" element={<OrdersPage />} />
          <Route path="order/:number" element={<OrderPage />} />
          <Route path="users" element={<Navigate to="active" replace />} />
          <Route path="users/:group" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route
            path="*"
            element={
              <AdminPage crumbs={[{ label: 'Админка', to: '/admin' }, { label: 'Страница не найдена' }]}>
                <EmptyState icon="search" title="Страница не найдена" action={{ label: 'К графику продаж', to: '/admin/analytics' }} />
              </AdminPage>
            }
          />
        </Route>
      </Routes>
    </AdminProvider>
  );
}
