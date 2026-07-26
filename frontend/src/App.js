// App.js - The main entry point. Shows signup/login if not logged in,
// shows the surah list if logged in.

import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import SurahList from './SurahList';

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
      <div>
        <h1>Quran Companion</h1>
        <p>Welcome, {username}!</p>
        <button onClick={handleLogout}>Log Out</button>
        <hr />
        <SurahList token={token} />
      </div>
    );
  }

  return (
    <div>
      <h1>Quran Companion</h1>
      <Signup onAuth={handleAuth} />
      <hr />
      <Login onAuth={handleAuth} />
    </div>
  );
}

export default App;