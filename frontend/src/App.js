// App.js - The main entry point. Shows auth forms or the main app depending
// on whether the user is logged in.

import { useState } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import SurahList from './SurahList';
import Profile from './Profile';

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');

  const handleAuth = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername('');
  };

  if (token) {
    return (
      <div className="app">
        <div className="navbar">
          <h1>Quran Companion</h1>
          <Profile token={token} username={username} onLogout={handleLogout} />
        </div>
        <SurahList token={token} />
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