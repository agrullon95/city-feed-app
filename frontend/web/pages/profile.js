import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/authContext';
import ui from '../styles/ui.module.css';
import styles from '../styles/Profile.module.css';

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const [name, setName] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateProfile({ username: name });
    } catch (err) {
      setError(err.toString());
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Your profile</h1>
        <div className={styles.card}>
          <div className={styles.row}>
            <img src={user?.avatarUrl || 'https://placehold.co/80'} alt="Your avatar" className={styles.avatarLarge} />
            <div className={styles.info}>
              <label className={styles.label}>Display name</label>
              <input className={styles.input} value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>

          {error && <div className={styles.inlineError} role="alert">{error}</div>}

          <div className={styles.actions}>
            <button className={ui.btnText} onClick={logout}>Log out</button>
            <button className={ui.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>

        <section className={styles.card}>
          <h2>Settings</h2>
          <p className={styles.muted}>No settings yet — coming soon.</p>
        </section>
      </div>
    </Layout>
  );
};

export default ProfilePage;
