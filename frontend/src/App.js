// App.js - The main entry point. Manages whether the user is logged in or not.
// If logged in, shows a welcome message. If not, shows signup and login forms.
// The token is stored in state so future API calls can use it.

import { useState } from 'react';
import Signup from './signup';
import Login from './login';

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