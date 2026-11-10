import { Link } from 'react-router-dom';
import Container from '../Container/Container';
import Icon from '../Icon/Icon';
import { footerNav, socials } from '../../data/navigation';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.footer__inner}>
        {footerNav.map((group) => (
          <nav key={group.title} className={styles.footer__group} aria-label={group.title.replace(':', '')}>
            <h2 className={styles.footer__title}>{group.title}</h2>
            <ul className={styles.footer__list}>
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.footer__link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <ul className={styles.footer__socials}>
          {socials.map((item) => (
            <li key={item.icon}>
              <a className={styles.footer__social} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                <Icon name={item.icon} height={25} width={item.icon === 'facebook' ? 15 : item.icon === 'vk' ? 30 : 27} />
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.footer__note}>Учебный проект. Заказы не принимаются, данные никуда не отправляются.</p>
      </Container>
    </footer>
  );
}
