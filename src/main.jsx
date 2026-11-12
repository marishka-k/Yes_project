import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { StoreProvider } from './store/StoreContext';
import { CatalogProvider } from './store/CatalogContext';
import './styles/global.css';

// HashRouter: на GitHub Pages прямые ссылки на страницы не дают 404
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <StoreProvider>
        <CatalogProvider>
          <App />
        </CatalogProvider>
      </StoreProvider>
    </HashRouter>
  </React.StrictMode>,
);
