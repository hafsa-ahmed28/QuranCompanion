// Profile.js — Islamic-themed avatar picker with editable display name.
// Users can change their avatar icon/color and display name, then log
// out from the dropdown menu.

import { useState, useEffect, useRef } from 'react';
import './Profile.css';

const AVATAR_ICONS = [
  { id: 'crescent', emoji: '🌙', label: 'Crescent' },
  { id: 'starcrescent', emoji: '☪️', label: 'Star & Crescent' },
  { id: 'mosque', emoji: '🕌', label: 'Mosque' },
  { id: 'kaaba', emoji: '🕋', label: 'Kaaba' },
  { id: 'book', emoji: '📖', label: 'Qur\'an' },
  { id: 'dua', emoji: '🤲', label: 'Du\'a' },
  { id: 'beads', emoji: '📿', label: 'Tasbih' },
  { id: 'shahada', emoji: '☝️', label: 'Tawhid' },
  { id: 'hijab', emoji: '🧕', label: 'Hijab' },
];

const AVATAR_COLORS = [
  { id: '#1F1A16', label: 'Ink' },
  { id: '#9C3D4A', label: 'Rose' },
  { id: '#A67B3A', label: 'Brass' },
  { id: '#2C5F2D', label: 'Green' },
  { id: '#4A3728', label: 'Brown' },
  { id: '#1B2A4A', label: 'Navy' },
];

function Profile(props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pickingAvatar, setPickingAvatar] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [avatarIcon, setAvatarIcon] = useState('crescent');
  const [avatarColor, setAvatarColor] = useState('#1F1A16');
  const [saved, setSaved] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        headers: { 'Authorization': 'Token ' + props.token },
      });
      const data = await response.json();
      if (response.ok) {
        setDisplayName(data.display_name || '');
        if (data.avatar_style) setAvatarIcon(data.avatar_style);
        if (data.avatar_color) setAvatarColor(data.avatar_color);
      }
    };
    fetchProfile();
  }, [props.token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
        setEditing(false);
        setPickingAvatar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/profile/update/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + props.token,
      },
      body: JSON.stringify({
        display_name: displayName,
        avatar_style: avatarIcon,
        avatar_color: avatarColor,
      }),
    });

    if (response.ok) {
      setSaved(true);
      setEditing(false);
      setPickingAvatar(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const currentEmoji = AVATAR_ICONS.find((i) => i.id === avatarIcon)?.emoji || '🌙';
  const nameShown = displayName || props.username;

  return (
    <div className="profile-wrapper" ref={menuRef}>
      <button
        className="profile-avatar-btn"
        onClick={() => setOpen(!open)}
        style={{ backgroundColor: avatarColor }}
        aria-label="Open profile menu"
      >
        <span className="profile-avatar-emoji">{currentEmoji}</span>
      </button>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div
              className="profile-avatar-large-icon"
              style={{ backgroundColor: avatarColor }}
            >
              <span>{currentEmoji}</span>
            </div>
            <div>
              <p className="profile-name">{nameShown}</p>
              <p className="profile-username">@{props.username}</p>
            </div>
          </div>

          {saved && <p className="profile-saved">✓ Saved</p>}

          {pickingAvatar ? (
            <div className="avatar-picker">
              <p className="avatar-picker-title">Choose your icon</p>
              <div className="avatar-icon-grid">
                {AVATAR_ICONS.map((icon) => (
                  <button
                    key={icon.id}
                    className={`avatar-icon-option ${avatarIcon === icon.id ? 'selected' : ''}`}
                    onClick={() => setAvatarIcon(icon.id)}
                  >
                    <span className="avatar-icon-emoji">{icon.emoji}</span>
                    <small>{icon.label}</small>
                  </button>
                ))}
              </div>
              <p className="avatar-picker-title" style={{ marginTop: '14px' }}>Choose your color</p>
              <div className="avatar-color-grid">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color.id}
                    className={`avatar-color-option ${avatarColor === color.id ? 'selected' : ''}`}
                    onClick={() => setAvatarColor(color.id)}
                    style={{ backgroundColor: color.id }}
                    title={color.label}
                  >
                    {avatarColor === color.id && <span>✓</span>}
                  </button>
                ))}
              </div>
              <div className="avatar-preview">
                <div
                  className="avatar-preview-circle"
                  style={{ backgroundColor: avatarColor }}
                >
                  <span>{AVATAR_ICONS.find((i) => i.id === avatarIcon)?.emoji}</span>
                </div>
                <small>Preview</small>
              </div>
              <div className="profile-edit-buttons">
                <button className="btn-primary" onClick={handleSave}>Save Avatar</button>
                <button className="btn-small" onClick={() => setPickingAvatar(false)}>Cancel</button>
              </div>
            </div>
          ) : editing ? (
            <div className="profile-edit">
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="profile-edit-buttons">
                <button className="btn-primary" onClick={handleSave}>Save</button>
                <button className="btn-small" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-menu">
              <button className="profile-menu-item" onClick={() => setPickingAvatar(true)}>
                Change Avatar
              </button>
              <button className="profile-menu-item" onClick={() => setEditing(true)}>
                Edit Name
              </button>
              <button className="profile-menu-item logout" onClick={props.onLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;