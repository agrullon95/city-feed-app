import PropTypes from 'prop-types';
import styles from '../styles/Layout.module.css';

// Navbar
export const Navbar = ({ title = 'City Feed', logout }) => (
  <header className={styles.header}>
    <div className={styles.title}>{title}</div>
    <div className={styles.profile}>
      <img
        src="https://placehold.co/40"
        alt="Profile"
        className={styles.avatar}
      />
      <button className={styles.logoutBtn} onClick={logout}>Log out</button>
    </div>
  </header>
);

Navbar.propTypes = {
  title: PropTypes.string,
  logout: PropTypes.func.isRequired,
};

export const MainContent = ({ children }) => (
  <main className={styles.main}>{children}</main>
);

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
};

// Footer
export const Footer = () => (
  <footer className={styles.footer}>
    © {new Date().getFullYear()} City Feed
  </footer>
);
