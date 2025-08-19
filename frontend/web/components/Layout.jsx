import React from 'react';
import PropTypes from 'prop-types';

// Navbar
export const Navbar = ({ title = "City Feed", logout }) => (
  <header
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 20px",
      borderBottom: "1px solid #eaeaea",
      position: "sticky",
      top: 0,
      background: "#f9f9f9",
      zIndex: 1000,
    }}
  >
    <div style={{ fontWeight: 700 }}>{title}</div>
    <div>
      <img
        src="https://via.placeholder.com/40"
        alt="Profile"
        style={{ width: 40, height: 40, borderRadius: "50%" }}
      />{' '}
      <button onClick={logout}>Log out</button>
    </div>
  </header>
);

Navbar.propTypes = {
  title: PropTypes.string,
  logout: PropTypes.func.isRequired,
};

export const MainContent = ({ children }) => (
  <main style={{ maxWidth: "960px", margin: "0 auto", padding: "20px" }}>
    {children}
  </main>
);

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
};

// Footer
export const Footer = () => (
  <footer
    style={{
      borderTop: "1px solid #eaeaea",
      padding: "16px 20px",
      textAlign: "center",
      marginTop: "24px",
      color: "#666",
      background: "#f9f9f9",
    }}
  >
    © {new Date().getFullYear()} City Feed
  </footer>
);
