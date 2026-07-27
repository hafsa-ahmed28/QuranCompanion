// SurahList.js - Shows all 114 surahs with filtering, search, progress bar,
// and listening tracking. Users can filter by all/listened/remaining and
// search by surah name.

import { useState, useEffect } from 'react';
import Goal from './Goal';

function SurahList(props) {
  const [surahs, setSurahs] = useState([]);
  const [listened, setListened] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

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

  const handleMarkListened = async (surahNumber) => {
    const response = await fetch('http://127.0.0.1:8000/api/mark-listened/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + props.token,
      },
      body: JSON.stringify({ surah_number: surahNumber }),
    });

    if (response.ok) {
      await fetchProgress();
    }
  };

  if (loading) {
    return <p>Loading surahs...</p>;
  }

  const listenedCount = listened.length;
  const progressPercent = Math.round((listenedCount / 114) * 100);

  // Filter surahs based on selected tab
  let filteredSurahs = surahs;
  if (filter === 'listened') {
    filteredSurahs = surahs.filter((s) => listened.includes(s.number));
  } else if (filter === 'remaining') {
    filteredSurahs = surahs.filter((s) => !listened.includes(s.number));
  }

  // Search filter
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

      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: progressPercent + '%' }}></div>
        </div>
        <p className="progress-text">{progressPercent}% complete</p>
      </div>

      {/* Filter tabs */}
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

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Surah list */}
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
                    <button className="btn-listen" onClick={() => handleMarkListened(surah.number)}>
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