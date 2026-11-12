import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './SiteLayout.module.css';

// Каркас витрины: шапка, содержимое страницы, подвал
export default function SiteLayout() {
  return (
    <div className={styles['site-layout']}>
      {/* Не ссылка #main: с HashRouter она сменила бы маршрут */}
      <button type="button" className={styles['site-layout__skip']} onClick={() => document.getElementById('main')?.focus()}>
        К содержимому
      </button>
      <Header />
      <main className={styles['site-layout__main']} id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
