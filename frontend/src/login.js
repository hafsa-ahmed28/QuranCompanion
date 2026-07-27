// Login.js - The login form component.

import { useState } from 'react';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      props.onAuth(data.token, data.username);
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="auth-card">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">Log In</button>
      </form>
      {message && <p className="error-message">{message}</p>}
    </div>
  );
}

export default Login;