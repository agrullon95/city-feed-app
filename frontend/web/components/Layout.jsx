import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';
import ui from '../styles/ui.module.css';
import { useAuth } from '../context/authContext';

// Navbar
export const Navbar = ({ title = 'City Feed', logout = () => { }, user = null, loading = false }) => {
  const router = useRouter();
  const isHomepage = router.pathname === '/';

  return (
    <header className={styles.header}>
      {!isHomepage && (
        <button className={styles.backBtn} onClick={() => router.back()}>&larr; Back</button>
      )}
      <div className={styles.title}>{title}</div>
      {/* show skeleton while auth is resolving, then profile when available */}
      {loading ? (
        <div className={styles.profileSkeleton} role="status" aria-live="polite">
          <span className={styles.skeletonAvatar} aria-hidden="true" />
          <span className={styles.skeletonText} aria-hidden="true" />
          <span className={ui.srOnly}>Authenticating…</span>
        </div>
      ) : (
        user && (
          <div className={styles.profile}>
            <img
              src={user.avatarUrl || 'https://placehold.co/40'}
              alt={user.name ? `${user.name} profile` : 'Profile'}
              className={styles.avatar}
            />
            <button
              className={ui.btnText}
              onClick={logout}
              aria-label="Log out"
            >
              Log out
            </button>
          </div>
        )
      )}
    </header>
  );
};

Navbar.propTypes = {
  title: PropTypes.string,
  logout: PropTypes.func,
  user: PropTypes.object,
  loading: PropTypes.bool,
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

const Layout = ({ children }) => {
  const { logout, user, loading } = useAuth();

  return (
    <div className={styles.layoutContainer}>
      <Navbar title="City Feed" logout={logout} user={user} loading={loading} />
      <div className={styles.contentWrapper}>
        <MainContent>{children}</MainContent>
      </div>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
