import { useState } from 'react';
import AdminPage from '../../../components/admin/AdminPage/AdminPage';
import AdminPageHead from '../../../components/admin/AdminPageHead/AdminPageHead';
import AdminNotice from '../../../components/admin/AdminNotice/AdminNotice';
import ConfirmModal from '../../../components/admin/ConfirmModal/ConfirmModal';
import Checkbox from '../../../components/Checkbox/Checkbox';
import Button from '../../../components/Button/Button';
import { useAdmin } from '../../../store/AdminContext';
import { useCatalog } from '../../../store/CatalogContext';
import styles from './SettingsPage.module.css';

// Настройка (макета нет): показ демо-заказов и сброс данных админки в этом браузере
export default function SettingsPage() {
  const { settings, setOption, resetDemoStatuses, clearBlacklist, changedDemoCount, blacklistCount } = useAdmin();
  const { resetCatalog } = useCatalog();
  const [confirm, setConfirm] = useState(null);
  const [notice, setNotice] = useState('');

  const actions = {
    catalog: {
      title: 'Сбросить каталог?',
      text: 'Правки товаров, созданные, архивные и удалённые товары вернутся к исходному каталогу витрины.',
      label: 'Сбросить каталог',
      run: resetCatalog,
      done: 'Каталог возвращён к исходному',
    },
    statuses: {
      title: 'Сбросить статусы демо-заказов?',
      text: 'Демо-заказы вернутся к сгенерированным статусам. Заказы с витрины не изменятся.',
      label: 'Сбросить статусы',
      run: resetDemoStatuses,
      done: 'Статусы демо-заказов сброшены',
    },
    blacklist: {
      title: 'Очистить черный список?',
      text: 'Все покупатели снова станут активными.',
      label: 'Очистить',
      run: clearBlacklist,
      done: 'Черный список очищен',
    },
  };

  const runConfirmed = () => {
    actions[confirm].run();
    setNotice(actions[confirm].done);
    setConfirm(null);
  };

  return (
    <AdminPage crumbs={[{ label: 'Настройка' }]}>
      <AdminPageHead title="Настройка" />
      {notice && <AdminNotice onClose={() => setNotice('')}>{notice}</AdminNotice>}

      <section className={styles['settings-page__card']} aria-labelledby="settings-data">
        <h2 id="settings-data" className={styles['settings-page__heading']}>
          Демо-данные
        </h2>
        <Checkbox checked={settings.demoOrders} onChange={(value) => setOption('demoOrders', value)}>
          Показывать демо-заказы в аналитике, заказах и списке покупателей
        </Checkbox>
        <p className={styles['settings-page__text']}>
          Демо-заказы сгенерированы с 1 января 2025 года по сегодняшний день, чтобы график не был пустым. Заказы, оформленные на
          витрине, видны всегда.
        </p>
      </section>

      <section className={styles['settings-page__card']} aria-labelledby="settings-reset">
        <h2 id="settings-reset" className={styles['settings-page__heading']}>
          Сброс данных
        </h2>
        <p className={styles['settings-page__text']}>Всё хранится только в этом браузере (localStorage), сброс нельзя отменить.</p>
        <ul className={styles['settings-page__actions']}>
          <li>
            <Button variant="secondary" onClick={() => setConfirm('catalog')}>
              Сбросить каталог товаров
            </Button>
          </li>
          <li>
            <Button variant="secondary" onClick={() => setConfirm('statuses')} disabled={!changedDemoCount}>
              Сбросить статусы демо-заказов{changedDemoCount ? ` (${changedDemoCount})` : ''}
            </Button>
          </li>
          <li>
            <Button variant="secondary" onClick={() => setConfirm('blacklist')} disabled={!blacklistCount}>
              Очистить черный список{blacklistCount ? ` (${blacklistCount})` : ''}
            </Button>
          </li>
        </ul>
      </section>

      <ConfirmModal
        isOpen={Boolean(confirm)}
        title={confirm ? actions[confirm].title : ''}
        text={confirm ? actions[confirm].text : ''}
        confirmLabel={confirm ? actions[confirm].label : ''}
        onConfirm={runConfirmed}
        onClose={() => setConfirm(null)}
      />
    </AdminPage>
  );
}
