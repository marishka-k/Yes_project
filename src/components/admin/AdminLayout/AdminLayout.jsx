import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import Footer from '../../Footer/Footer';
import Drawer from '../../Drawer/Drawer';
import Container from '../../Container/Container';
import styles from './AdminLayout.module.css';

// Каркас админки: плашка демо-режима, шапка (логотип и аватар), страница, подвал как на витрине.
// До 1023 px меню разделов открывается из бургера в шапке
export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className={styles['admin-layout']}>
      <button type="button" className={styles['admin-layout__skip']} onClick={() => document.getElementById('main')?.focus()}>
        К содержимому
      </button>
      <div className={styles['admin-layout__demo']} role="note">
        <Container className={styles['admin-layout__demo-inner']}>
          <p>Демо-режим: учебный проект, данные хранятся только в этом браузере.</p>
          <Link to="/" className={styles['admin-layout__site-link']}>
            На сайт
          </Link>
        </Container>
      </div>
      <AdminHeader menuOpen={menuOpen} onMenu={() => setMenuOpen(true)} />
      <main className={styles['admin-layout__main']} id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <Drawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} title="Админка">
        <AdminSidebar variant="drawer" />
      </Drawer>
    </div>
  );
}
