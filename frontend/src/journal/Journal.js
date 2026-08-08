// Journal.js — A bound-book journal. Each reflection is a page you turn to.
// A contents strip above the page groups entries by date so multiple
// reflections on the same day appear under one date label.

import { useState, useEffect } from 'react';
import './Journal.css';

function Journal(props) {
  const [reflections, setReflections] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState('');
  const [text, setText] = useState('');
  const [writing, setWriting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const refRes = await fetch('http://127.0.0.1:8000/api/reflections/', {
        headers: { 'Authorization': 'Token ' + props.token },
      });
      const refData = await refRes.json();
      if (refRes.ok) setReflections(refData);

      const surahRes = await fetch('http://127.0.0.1:8000/api/surahs/', {
        headers: { 'Authorization': 'Token ' + props.token },
      });
      const surahData = await surahRes.json();
      if (surahRes.ok) setSurahs(surahData);

      setLoading(false);
    };
    fetchData();
  }, [props.token]);

  const handleSave = async () => {
    if (!selectedSurah || !text.trim()) return;
    setSaving(true);

    const response = await fetch('http://127.0.0.1:8000/api/reflections/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + props.token,
      },
      body: JSON.stringify({
        surah_number: parseInt(selectedSurah),
        text: text.trim(),
      }),
    });

    const data = await response.json();
    if (response.ok) {
      const newList = [data, ...reflections];
      setReflections(newList);
      setText('');
      setSelectedSurah('');
      setWriting(false);
      setPageIndex(0);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/reflections/${id}/delete/`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Token ' + props.token },
    });
    if (response.ok) {
      const newList = reflections.filter((r) => r.id !== id);
      setReflections(newList);
      if (pageIndex >= newList.length && newList.length > 0) {
        setPageIndex(newList.length - 1);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) return <p className="loading-line">Turning to the page...</p>;

  const currentReflection = reflections[pageIndex];
  const totalPages = reflections.length;

  // Group reflections by date for the contents strip
  const groups = [];
  reflections.forEach((r, i) => {
    const dateKey = formatShortDate(r.created_at);
    const existing = groups.find((g) => g.dateKey === dateKey);
    if (existing) {
      existing.items.push({ ...r, index: i });
    } else {
      groups.push({ dateKey, items: [{ ...r, index: i }] });
    }
  });

  return (
    <div className="journal">
      <div className="journal-header">
        <div>
          <p className="journal-eyebrow">The Journal</p>
          <h2 className="journal-title">My Reflections</h2>
          <p className="journal-subtitle">
            {totalPages === 0
              ? 'A quiet place for what moved you.'
              : `${totalPages} ${totalPages === 1 ? 'page' : 'pages'} in your book`}
          </p>
        </div>
        {!writing && (
          <button className="btn-new-reflection" onClick={() => setWriting(true)}>
            + New Page
          </button>
        )}
      </div>

      {writing && (
        <div className="book-spread">
          <div className="book-spread-page left">
            <p className="book-eyebrow">A New Page</p>
            <h3 className="book-page-title">What did you hear?</h3>

            <div className="form-group">
              <label>Reflecting on</label>
              <select
                value={selectedSurah}
                onChange={(e) => setSelectedSurah(e.target.value)}
                className="journal-select"
              >
                <option value="">Choose a surah...</option>
                {surahs.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name_english} — {s.name_arabic}
                  </option>
                ))}
              </select>
            </div>

            <p className="book-instructions">
              Write what you noticed, what stayed with you, what you want to remember.
              There is no right length. This page is only for you.
            </p>
          </div>

          <div className="book-spread-page right">
            <textarea
              className="book-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Begin here..."
              rows={12}
              autoFocus
            />
            <div className="journal-write-actions">
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving || !selectedSurah || !text.trim()}
              >
                {saving ? 'Saving...' : 'Save Page'}
              </button>
              <button
                className="btn-small"
                onClick={() => { setWriting(false); setText(''); setSelectedSurah(''); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {totalPages === 0 && !writing ? (
        <div className="journal-empty">
          <span className="journal-empty-icon">❦</span>
          <p>Your journal is waiting.</p>
          <p className="journal-empty-hint">
            When something in a surah stays with you — an image, a phrase, a feeling —
            write it here. Over time, this becomes your own quiet companion to the Qur'an.
          </p>
        </div>
      ) : totalPages > 0 && !writing ? (
        <div className="book-viewer">
          {/* Contents strip — grouped by date */}
          {totalPages > 1 && (
            <div className="book-contents">
              <span className="book-contents-label">Contents</span>
              <div className="book-contents-list">
                {groups.map((group) => (
                  <div key={group.dateKey} className="book-contents-group">
                    <span className="book-contents-date">{group.dateKey}</span>
                    <div className="book-contents-page-dots">
                      {group.items.map((item, j) => (
                        <button
                          key={item.id}
                          className={`book-contents-dot ${item.index === pageIndex ? 'active' : ''}`}
                          onClick={() => setPageIndex(item.index)}
                          title={`${item.surah_name} · ${formatDate(item.created_at)}`}
                          aria-label={`Go to page ${item.index + 1}: ${item.surah_name}`}
                        >
                          {group.items.length > 1 ? j + 1 : '•'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* The single page currently open */}
          <div className="book-spread single">
            <div className="book-spread-page right full">
              <div className="book-page-header">
                <div>
                  <p className="journal-entry-date">{formatDate(currentReflection.created_at)}</p>
                  <h3 className="book-page-title small">
                    {currentReflection.surah_name}
                    <span className="arabic-name"> {currentReflection.surah_arabic}</span>
                  </h3>
                </div>
                <button
                  className="journal-delete-btn"
                  onClick={() => handleDelete(currentReflection.id)}
                  aria-label="Delete this page"
                  title="Delete this page"
                >
                  ×
                </button>
              </div>
              <div className="book-page-body">
                {currentReflection.text}
              </div>
              <div className="book-page-number">
                — page {pageIndex + 1} of {totalPages} —
              </div>
            </div>
          </div>

          {/* Page turn controls */}
          {totalPages > 1 && (
            <div className="book-nav">
              <button
                className="book-nav-btn"
                onClick={() => setPageIndex(pageIndex - 1)}
                disabled={pageIndex === 0}
                aria-label="Previous page"
              >
                ◀ Previous
              </button>
              <span className="book-nav-position">
                {pageIndex + 1} / {totalPages}
              </span>
              <button
                className="book-nav-btn"
                onClick={() => setPageIndex(pageIndex + 1)}
                disabled={pageIndex === totalPages - 1}
                aria-label="Next page"
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Journal;