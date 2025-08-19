import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';

// Navbar
export const Navbar = ({ title = 'City Feed', logout }) => {
  const router = useRouter();
  const isHomepage = router.pathname === '/';

  return (
    <header className={styles.header}>
      {!isHomepage && (
        <button className={styles.backBtn} onClick={() => router.back()}>&larr; Back</button>
      )}
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
};

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

const Layout = ({ children }) => (
  <div className={styles.layoutContainer}>
    <Navbar title="City Feed" logout={() => { }} />
    <div className={styles.contentWrapper}>
      <MainContent>{children}</MainContent>
    </div>
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
