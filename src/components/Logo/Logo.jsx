import { Link } from 'react-router-dom';
import { asset } from '../../utils/asset';
import styles from './Logo.module.css';

// Логотип «yes» из макета (SVG выгружен из Figma)
export default function Logo({ onClick }) {
  return (
    <Link to="/" className={styles.logo} onClick={onClick}>
      <img className={styles.logo__image} src={asset('images/logo.svg')} width="128" height="60" alt="Yes — на главную" />
    </Link>
  );
}
