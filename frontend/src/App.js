// App.js — The main entry point. Manages auth state, navigation between
// tracker and journal, and the About/welcome modal.

import { useState, useEffect } from 'react';
import './App.css';
import Signup from './auth/Signup';
import Login from './auth/Login';
import SurahList from './tracker/SurahList';
import Journal from './journal/Journal';
import Profile from './profile/Profile';
import AboutModal from './shared/AboutModal';
import ScrollToTop from './shared/ScrollToTop';

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [page, setPage] = useState('tracker');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutIsFirstTime, setAboutIsFirstTime] = useState(false);

  // On login, check whether this user has ever seen the welcome modal
  useEffect(() => {
    if (token && username) {
      const seenKey = `quran-companion-welcomed-${username}`;
      const hasSeenWelcome = window.localStorage.getItem(seenKey);
      if (!hasSeenWelcome) {
        setAboutIsFirstTime(true);
        setAboutOpen(true);
        window.localStorage.setItem(seenKey, 'true');
      }
    }
  }, [token, username]);

  const handleAuth = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername('');
    setPage('tracker');
    setAboutOpen(false);
  };

  const openAbout = () => {
    setAboutIsFirstTime(false);
    setAboutOpen(true);
  };

  const closeAbout = () => setAboutOpen(false);

  if (token) {
    return (
      <div className="app">
        <div className="navbar">
          <h1>Quran Companion</h1>
          <div className="nav-tabs">
            <button
              className={`nav-tab ${page === 'tracker' ? 'active' : ''}`}
              onClick={() => setPage('tracker')}
            >
              Tracker
            </button>
            <button
              className={`nav-tab ${page === 'journal' ? 'active' : ''}`}
              onClick={() => setPage('journal')}
            >
              Journal
            </button>
            <button className="nav-tab nav-tab-about" onClick={openAbout}>
              About
            </button>
          </div>
          <Profile token={token} username={username} onLogout={handleLogout} />
        </div>

        {page === 'tracker' ? (
          <SurahList token={token} />
        ) : (
          <Journal token={token} />
        )}

        {aboutOpen && <AboutModal onClose={closeAbout} firstTime={aboutIsFirstTime} />}
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="auth-container">
        <h1>Quran Companion</h1>
        <p className="auth-subtitle">A quiet companion for your Qur'an listening journey</p>
        <div className="auth-forms">
          <Signup onAuth={handleAuth} />
          <Login onAuth={handleAuth} />
        </div>
      </div>
    </div>
  );
}

export default App;