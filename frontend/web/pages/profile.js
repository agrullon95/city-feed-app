import React from 'react';
import { useAuth } from '../context/authContext';
import ui from '../styles/ui.module.css';
import styles from '../styles/Profile.module.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      <h1>Your profile</h1>
      <div className={styles.card}>
        <div className={styles.row}>
          <img src={user?.avatarUrl || 'https://placehold.co/80'} alt="Your avatar" className={styles.avatarLarge} />
          <div className={styles.info}>
            <div className={styles.label}>Username</div>
            <div className={styles.username}>{user?.username || '—'}</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={ui.btnText} onClick={logout}>Log out</button>
        </div>
      </div>

      <section className={styles.card}>
        <h2>Settings</h2>
        <p className={styles.muted}>No settings yet — coming soon.</p>
      </section>
    </div>
  );
};

export default ProfilePage;
