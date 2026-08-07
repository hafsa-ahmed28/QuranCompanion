// SurahList.js — The tracker page. Statement goal card, progress viz,
// filter tabs, search, and a self-scrolling surah list section so the
// long list doesn't hijack the whole page's scroll.

import { useState, useEffect } from 'react';
import Goal from './Goal';
import ProgressVisual from './ProgressVisual';

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

  if (loading) return <p className="loading-line">Opening your companion...</p>;

  const listenedCount = listened.length;

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
            <span className="reflect-prompt-icon">❦</span>
            <div>
              <p className="reflect-prompt-title">
                You just heard {reflectPrompt.name_english}
              </p>
              <p className="reflect-prompt-subtitle">
                Would you like to reflect on what stayed with you?
              </p>
            </div>
          </div>
          <textarea
            className="book-textarea"
            value={reflectText}
            onChange={(e) => setReflectText(e.target.value)}
            placeholder="What moved you? What do you want to remember?"
            rows={4}
            style={{ minHeight: '140px' }}
          />
          <div className="reflect-prompt-actions">
            <button
              className="btn-primary"
              onClick={handleSaveReflection}
              disabled={saving || !reflectText.trim()}
              style={{ width: 'auto', padding: '10px 28px', marginTop: 0 }}
            >
              {saving ? 'Saving...' : 'Save to Journal'}
            </button>
            <button className="btn-small" onClick={dismissPrompt}>
              Not now
            </button>
            <button className="btn-mute" onClick={dismissAndMute}>
              Don't ask again this session
            </button>
          </div>
        </div>
      )}

      <ProgressVisual surahs={surahs} listened={listened} />

      <div className="surah-list-section">
        <div className="surah-list-header">
          <div>
            <p className="section-eyebrow">The Surahs</p>
            <h2 className="section-title">
              {filter === 'all' && 'All 114'}
              {filter === 'listened' && 'Already Listened'}
              {filter === 'remaining' && 'Yet to Come'}
            </h2>
          </div>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All · {surahs.length}
          </button>
          <button
            className={`filter-tab ${filter === 'listened' ? 'active' : ''}`}
            onClick={() => setFilter('listened')}
          >
            Listened · {listenedCount}
          </button>
          <button
            className={`filter-tab ${filter === 'remaining' ? 'active' : ''}`}
            onClick={() => setFilter('remaining')}
          >
            Remaining · {114 - listenedCount}
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

        {/* Self-scrolling list container */}
        <div className="surah-list-scroll">
          <div className="surah-list">
            {filteredSurahs.length === 0 ? (
              <p className="empty-state">Nothing here yet.</p>
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
                      <small>
                        <em>{surah.english_translation}</em>
                        <span className="surah-meta-dot"> · </span>
                        {surah.number_of_ayahs} ayahs
                        <span className="surah-meta-dot"> · </span>
                        {surah.revelation_type}
                      </small>
                    </div>
                    <div>
                      {isListened ? (
                        <span className="listened-badge" title="You have listened to this surah">✓</span>
                      ) : (
                        <button className="btn-listen" onClick={() => handleMarkListened(surah)}>
                          Mark Listened
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurahList;