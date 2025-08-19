import Feed from "../components/Feed";
import PropTypes from "prop-types";
import NewPostForm from "../components/NewPostForm";
import React, { useState } from "react";
import { AuthProvider, useAuth } from "../context/authContext";
import { Navbar, MainContent, Footer } from "../components/Layout";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

function HomeContent() {
  const { user, loading, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSignup, setShowSignup] = useState(false);

  const handlePostCreated = () => setRefreshKey((prev) => prev + 1);

  if (loading)
    return <div style={styles.loading}>Loading...</div>;

  if (!user) {
    const switchFooter = (
      <div className=""/* footer styled by form module */>
        {showSignup ? (
          <>
            Already have an account?{" "}
            <button onClick={() => setShowSignup(false)}>
              Login
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <button onClick={() => setShowSignup(true)}>
              Sign Up
            </button>
          </>
        )}
      </div>
    );

    return (
      <MainContent>
        {showSignup ? <SignupForm footer={switchFooter} /> : <LoginForm footer={switchFooter} />}
      </MainContent>
    );
  }

  // If logged in -> show feed
  return (
    <>
      <Navbar logout={logout} />
      <MainContent>
        <h1 style={styles.welcomeMessage}>Welcome, {user.username} 👋</h1>
        <NewPostForm onPostCreated={handlePostCreated} />
        <Feed key={refreshKey} />
      </MainContent>
      <Footer />
    </>
  );
}

const styles = {
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
    marginTop: "20px",
  },
  authContainer: {
    textAlign: "center",
    padding: "20px",
    border: "1px solid #eaeaea",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  authSwitch: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#555",
  },
  authButton: {
    background: "none",
    border: "none",
    color: "#0070f3",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
  },
  welcomeMessage: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
};

export default function Home({ pageProps }) {
  return (
    <AuthProvider initialUser={pageProps?.initialUser}>
      <HomeContent />
    </AuthProvider>
  );
}

Home.propTypes = {
  pageProps: PropTypes.shape({
    initialUser: PropTypes.object,
  }),
};
