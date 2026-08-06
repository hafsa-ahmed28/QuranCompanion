// Journal.js - The reflection journal. Users can write reflections on any surah,
// browse past entries, and delete them. This is the heart of the app — the part
// that makes it more than just a tracker.

import { useState, useEffect } from 'react';

function Journal(props) {
  const [reflections, setReflections] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState('');
  const [text, setText] = useState('');
  const [writing, setWriting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch reflections
      const refResponse = await fetch('http://127.0.0.1:8000/api/reflections/', {
        headers: { 'Authorization': 'Token ' + props.token },
      });
      const refData = await refResponse.json();
      if (refResponse.ok) {
        setReflections(refData);
      }

      // Fetch surahs for the dropdown
      const surahResponse = await fetch('http://127.0.0.1:8000/api/surahs/', {
        headers: { 'Authorization': 'Token ' + props.token },
      });
      const surahData = await surahResponse.json();
      if (surahResponse.ok) {
        setSurahs(surahData);
      }

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
      setReflections([data, ...reflections]);
      setText('');
      setSelectedSurah('');
      setWriting(false);
    }

    setSaving(false);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/reflections/${id}/delete/`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Token ' + props.token },
    });

    if (response.ok) {
      setReflections(reflections.filter((r) => r.id !== id));
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

  if (loading) {
    return <p>Loading your journal...</p>;
  }

  return (
    <div className="journal">
      <div className="journal-header">
        <div>
          <h2 className="journal-title">My Reflections</h2>
          <p className="journal-subtitle">
            {reflections.length === 0
              ? 'Start your first reflection — what moved you today?'
              : `${reflections.length} ${reflections.length === 1 ? 'reflection' : 'reflections'} written`
            }
          </p>
        </div>
        {!writing && (
          <button className="btn-new-reflection" onClick={() => setWriting(true)}>
            + New Reflection
          </button>
        )}
      </div>

      {writing && (
        <div className="journal-write-card">
          <div className="journal-write-header">
            <span className="journal-write-icon">📝</span>
            <h3>New Reflection</h3>
          </div>
          <div className="form-group">
            <label>Which surah are you reflecting on?</label>
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
          <div className="form-group">
            <label>What did you learn, feel, or want to remember?</label>
            <textarea
              className="journal-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your thoughts here..."
              rows={6}
            />
          </div>
          <div className="journal-write-actions">
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving || !selectedSurah || !text.trim()}
            >
              {saving ? 'Saving...' : 'Save Reflection'}
            </button>
            <button className="btn-small" onClick={() => { setWriting(false); setText(''); setSelectedSurah(''); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {reflections.length === 0 && !writing ? (
        <div className="journal-empty">
          <span className="journal-empty-icon">📖</span>
          <p>Your journal is waiting.</p>
          <p className="journal-empty-hint">Reflect on a surah — what resonated with you, what you want to remember, how it made you feel.</p>
        </div>
      ) : (
        <div className="journal-entries">
          {reflections.map((r) => (
            <div key={r.id} className="journal-entry">
              <div className="journal-entry-header">
                <div>
                  <span className="journal-entry-surah">
                    {r.surah_name} <span className="arabic-name">{r.surah_arabic}</span>
                  </span>
                  <span className="journal-entry-date">{formatDate(r.created_at)}</span>
                </div>
                <button
                  className="journal-delete-btn"
                  onClick={() => handleDelete(r.id)}
                  title="Delete reflection"
                >
                  ×
                </button>
              </div>
              <p className="journal-entry-text">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Journal;