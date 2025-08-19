import Feed from "../components/Feed";
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

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <MainContent>
        {showSignup ? <SignupForm /> : <LoginForm />}
        <p style={{ marginTop: "10px" }}>
          {showSignup ? (
            <>
              Already have an account?{" "}
              <button onClick={() => setShowSignup(false)}>Login</button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button onClick={() => setShowSignup(true)}>Sign Up</button>
            </>
          )}
        </p>
      </MainContent>
    );
  }

  // If logged in -> show feed
  return (
    <>
      <Navbar logout={logout} />
      <MainContent>
        <h1>Welcome, {user.username} 👋</h1>
        <NewPostForm onPostCreated={handlePostCreated} />
        <Feed key={refreshKey} />
      </MainContent>
      <Footer />
    </>
  );
}

export default function Home({ pageProps }) {
  return (
    <AuthProvider initialUser={pageProps?.initialUser}>
      <HomeContent />
    </AuthProvider>
  );
}
