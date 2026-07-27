// SurahList.js - Shows all 114 surahs with listening tracking and goal setting.

import { useState, useEffect } from 'react';
import Goal from './Goal';

function SurahList(props) {
  const [surahs, setSurahs] = useState([]);
  const [listened, setListened] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <Goal token={props.token} listenedCount={listened.length} />
      <hr />
      {surahs.map((surah) => {
        const isListened = listened.includes(surah.number);
        return (
          <div key={surah.number} style={{
            padding: '10px 0',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <strong>{surah.number}. {surah.name_english}</strong> — {surah.name_arabic}
              <br />
              <small>{surah.english_translation} · {surah.number_of_ayahs} ayahs</small>
            </div>
            <div>
              {isListened ? (
                <span style={{ color: 'green' }}>✓ Listened</span>
              ) : (
                <button onClick={() => handleMarkListened(surah.number)}>
                  Mark as Listened
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SurahList;