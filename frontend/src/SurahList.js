// SurahList.js - Displays all 114 surahs after the user logs in.
// Fetches the list from the backend using the auth token to prove
// the user is logged in.

import { useState, useEffect } from 'react';

function SurahList(props) {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/surahs/', {
        headers: {
          'Authorization': 'Token ' + props.token,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSurahs(data);
      }

      setLoading(false);
    };

    fetchSurahs();
  }, [props.token]);

  if (loading) {
    return <p>Loading surahs...</p>;
  }

  return (
    <div>
      <h2>All Surahs</h2>
      <p>{surahs.length} surahs loaded</p>
      {surahs.map((surah) => (
        <div key={surah.number} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <strong>{surah.number}. {surah.name_english}</strong> — {surah.name_arabic}
          <br />
          <small>{surah.english_translation} · {surah.number_of_ayahs} ayahs · {surah.revelation_type}</small>
        </div>
      ))}
    </div>
  );
}

export default SurahList;