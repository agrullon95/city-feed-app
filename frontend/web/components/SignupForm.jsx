import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import styles from "../styles/SignupForm.module.css";
import PropTypes from 'prop-types';

const SignupForm = ({ footer }) => {
  const { signup, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup({ username, email, password });
      // user state updates automatically in context
    } catch (err) {
      setError(err?.message || String(err));
    }
  };

  return (
    <section className={styles.card} aria-labelledby="signup-heading">
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 id="signup-heading" className={styles.title}>
          Create an account
        </h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label className="sr-only" htmlFor="signup-username">
            Username
          </label>
          <input
            id="signup-username"
            className={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className="sr-only" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className="sr-only" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <div className={styles.hint}>
            By signing up you agree to our terms. We won't share your email.
          </div>
        </div>

        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {footer && <div className={styles.formFooter}>{footer}</div>}
      </form>
    </section>
  );
};

SignupForm.propTypes = {
  footer: PropTypes.node,
};

export default SignupForm;
