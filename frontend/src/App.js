// App.js — The main entry point. Shows auth forms or the main app.
// Logged-in users can switch between the tracker and the journal.

import { useState } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import SurahList from './SurahList';
import Journal from './Journal';
import Profile from './Profile';

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [page, setPage] = useState('tracker');

  const handleAuth = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername('');
    setPage('tracker');
  };

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
          </div>
          <Profile token={token} username={username} onLogout={handleLogout} />
        </div>
        {page === 'tracker' ? (
          <SurahList token={token} />
        ) : (
          <Journal token={token} />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="auth-container">
        <h1>Quran Companion</h1>
        <p className="auth-subtitle">Track your Qur'an listening journey</p>
        <div className="auth-forms">
          <Signup onAuth={handleAuth} />
          <Login onAuth={handleAuth} />
        </div>
      </div>
    </div>
  );
}

export default App;