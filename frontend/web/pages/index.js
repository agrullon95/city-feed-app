import Feed from "../components/Feed";
import PropTypes from "prop-types";
import NewPostForm from "../components/NewPostForm";
import React, { useState } from "react";
import { AuthProvider, useAuth } from "../context/authContext";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import ui from '../styles/ui.module.css';
import { MainContent } from "../components/Layout";

function HomeContent() {
  const { user, loading, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSignup, setShowSignup] = useState(false);

  const handlePostCreated = () => setRefreshKey((prev) => prev + 1);

  if (loading) return <div className={ui.loading}>Loading...</div>;

  if (!user) {
    const switchFooter = (
      <div className={ui.center}>
        {showSignup ? (
          <>
            Already have an account?{' '}
            <button className={ui.btnText} onClick={() => setShowSignup(false)}>Login</button>
          </>
        ) : (
          <>
            Don’t have an account?{' '}
            <button className={ui.btnText} onClick={() => setShowSignup(true)}>Sign Up</button>
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
    <MainContent>
      <h1 className={ui.center}>Welcome, {user.username} 👋</h1>
      <NewPostForm onPostCreated={handlePostCreated} />
      <Feed key={refreshKey} />
    </MainContent>
  );
}

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
