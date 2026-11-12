import { Link } from 'react-router-dom';
import { asset } from '../../utils/asset';
import styles from './Logo.module.css';

// Логотип «yes» из макета (SVG выгружен из Figma). to — куда ведёт (в админке — на её главную)
export default function Logo({ to = '/', label = 'Yes — на главную', onClick }) {
  return (
    <Link to={to} className={styles.logo} onClick={onClick}>
      <img className={styles.logo__image} src={asset('images/logo.svg')} width="128" height="60" alt={label} />
    </Link>
  );
}
