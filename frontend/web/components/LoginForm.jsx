import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import styles from "../styles/LoginForm.module.css";
import PropTypes from 'prop-types';

const LoginForm = ({ footer }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      // Redirect or show success — AuthContext handles user state
    } catch (err) {
      setError(err?.message || String(err));
    }
  };

  return (
    <div className={styles.centerWrap}>
      <section className={styles.card} aria-labelledby="login-heading">
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 id="login-heading" className={styles.title}>Login</h2>
          {error && <div className={styles.error}>{error}</div>}

          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {footer && <div className={styles.formFooter}>{footer}</div>}
        </form>
      </section>
    </div>
  );
};

LoginForm.propTypes = {
  footer: PropTypes.node,
};

export default LoginForm;
