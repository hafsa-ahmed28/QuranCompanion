// SurahList.js — Shows all 114 surahs with listening tracking, goal setting,
// and an optional reflection prompt after marking a surah as listened.

import { useState, useEffect } from 'react';
import Goal from './Goal';

function SurahList(props) {
  const [surahs, setSurahs] = useState([]);
  const [listened, setListened] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reflectPrompt, setReflectPrompt] = useState(null);
  const [reflectText, setReflectText] = useState('');
  const [saving, setSaving] = useState(false);
  const [mutePrompts, setMutePrompts] = useState(false);

  const fetchProgress = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/listening-progress/', {
      headers: { 'Authorization': 'Token ' + props.token },
    });
    const data = await response.json();
    if (response.ok) {
      setListened(data.listened);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const surahResponse = await fetch('http://127.0.0.1:8000/api/surahs/', {
        headers: { 'Authorization': 'Token ' + props.token },
      });
      const surahData = await surahResponse.json();
      if (surahResponse.ok) {
        setSurahs(surahData);
      }

      await fetchProgress();
      setLoading(false);
    };

    fetchData();
  }, [props.token]);

  const handleMarkListened = async (surah) => {
    const response = await fetch('http://127.0.0.1:8000/api/mark-listened/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + props.token,
      },
      body: JSON.stringify({ surah_number: surah.number }),
    });

    if (response.ok) {
      await fetchProgress();
      if (!mutePrompts) {
        setReflectPrompt(surah);
      }
    }
  };

  const handleSaveReflection = async () => {
    if (!reflectText.trim() || !reflectPrompt) return;
    setSaving(true);

    const response = await fetch('http://127.0.0.1:8000/api/reflections/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + props.token,
      },
      body: JSON.stringify({
        surah_number: reflectPrompt.number,
        text: reflectText.trim(),
      }),
    });

    if (response.ok) {
      setReflectPrompt(null);
      setReflectText('');
    }
    setSaving(false);
  };

  const dismissPrompt = () => {
    setReflectPrompt(null);
    setReflectText('');
  };

  const dismissAndMute = () => {
    setReflectPrompt(null);
    setReflectText('');
    setMutePrompts(true);
  };

  if (loading) {
    return <p>Loading surahs...</p>;
  }

  const listenedCount = listened.length;
  const progressPercent = Math.round((listenedCount / 114) * 100);

  let filteredSurahs = surahs;
  if (filter === 'listened') {
    filteredSurahs = surahs.filter((s) => listened.includes(s.number));
  } else if (filter === 'remaining') {
    filteredSurahs = surahs.filter((s) => !listened.includes(s.number));
  }

  if (search.trim() !== '') {
    const searchLower = search.toLowerCase();
    filteredSurahs = filteredSurahs.filter((s) =>
      s.name_english.toLowerCase().includes(searchLower) ||
      s.name_arabic.includes(search) ||
      s.number.toString() === search.trim()
    );
  }

  return (
    <div>
      <Goal token={props.token} listenedCount={listenedCount} />

      {reflectPrompt && (
        <div className="reflect-prompt">
          <div className="reflect-prompt-header">
            <span className="reflect-prompt-icon">✨</span>
            <div>
              <p className="reflect-prompt-title">
                You just listened to {reflectPrompt.name_english}!
              </p>
              <p className="reflect-prompt-subtitle">
                Want to reflect on what you heard?
              </p>
            </div>
          </div>
          <textarea
            className="journal-textarea"
            value={reflectText}
            onChange={(e) => setReflectText(e.target.value)}
            placeholder="What moved you? What did you learn? How did it make you feel?"
            rows={4}
          />
          <div className="reflect-prompt-actions">
            <button
              className="btn-primary"
              onClick={handleSaveReflection}
              disabled={saving || !reflectText.trim()}
              style={{ width: 'auto', padding: '10px 24px' }}
            >
              {saving ? 'Saving...' : 'Save Reflection'}
            </button>
            <button className="btn-small" onClick={dismissPrompt}>
              Skip for now
            </button>
            <button className="btn-mute" onClick={dismissAndMute}>
              Don't ask again
            </button>
          </div>
        </div>
      )}

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: progressPercent + '%' }}></div>
        </div>
        <p className="progress-text">{progressPercent}% complete</p>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({surahs.length})
        </button>
        <button
          className={`filter-tab ${filter === 'listened' ? 'active' : ''}`}
          onClick={() => setFilter('listened')}
        >
          Listened ({listenedCount})
        </button>
        <button
          className={`filter-tab ${filter === 'remaining' ? 'active' : ''}`}
          onClick={() => setFilter('remaining')}
        >
          Remaining ({114 - listenedCount})
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="surah-list">
        {filteredSurahs.length === 0 ? (
          <p className="empty-state">No surahs match your search.</p>
        ) : (
          filteredSurahs.map((surah) => {
            const isListened = listened.includes(surah.number);
            return (
              <div key={surah.number} className={`surah-card ${isListened ? 'listened' : ''}`}>
                <div className="surah-number-badge">
                  <span>{surah.number}</span>
                </div>
                <div className="surah-info">
                  <h3>
                    {surah.name_english}
                    <span className="arabic-name"> {surah.name_arabic}</span>
                  </h3>
                  <small>{surah.english_translation} · {surah.number_of_ayahs} ayahs · {surah.revelation_type}</small>
                </div>
                <div>
                  {isListened ? (
                    <span className="listened-badge">✓</span>
                  ) : (
                    <button className="btn-listen" onClick={() => handleMarkListened(surah)}>
                      Listen
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SurahList;