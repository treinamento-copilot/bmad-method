import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <span className={styles.brandIcon}>🍖</span>
          <span className={styles.brandText}>ChurrasApp</span>
        </div>
        
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <a href="#dashboard" className={`${styles.navLink} ${styles.active}`}>
              Dashboard
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#eventos" className={styles.navLink}>
              Eventos
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#convidados" className={styles.navLink}>
              Convidados
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#compras" className={styles.navLink}>
              Lista de Compras
            </a>
          </li>
        </ul>

        <div className={styles.navActions}>
          <button className={styles.newEventBtn}>
            + Novo Evento
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;