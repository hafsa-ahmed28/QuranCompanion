// config.js — The single place that defines the backend URL.
// In development, it points to localhost. In production, it points to
// the live Render backend. Change this one line to switch environments.

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export default API_URL;