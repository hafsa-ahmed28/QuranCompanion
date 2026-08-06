// ProgressVisual.js — A manuscript-inspired progress panel showing all 114
// surahs as small numbered marks. Completed surahs fill with brass; the whole
// piece reads as a page from an old mushaf index rather than a modern progress bar.

import { useState } from 'react';

function ProgressVisual(props) {
  const [hovered, setHovered] = useState(null);
  const { surahs, listened } = props;

  if (!surahs || surahs.length === 0) return null;

  const listenedCount = listened.length;
  const percent = Math.round((listenedCount / 114) * 100);

  return (
    <div className="progress-visual">
      <div className="progress-visual-header">
        <div>
          <p className="progress-visual-eyebrow">The Journey So Far</p>
          <h3 className="progress-visual-title">Your Companion of Verses</h3>
        </div>
        <div className="progress-visual-count-wrap">
          <span className="progress-visual-count-big">{listenedCount}</span>
          <span className="progress-visual-count-slash">/</span>
          <span className="progress-visual-count-total">114</span>
        </div>
      </div>

      <div className="surah-marks">
        {surahs.map((surah) => {
          const isListened = listened.includes(surah.number);
          return (
            <button
              key={surah.number}
              className={`surah-mark ${isListened ? 'completed' : ''}`}
              onMouseEnter={() => setHovered(surah)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(surah)}
              onBlur={() => setHovered(null)}
              aria-label={`Surah ${surah.number} ${surah.name_english}${isListened ? ', listened' : ''}`}
            >
              {surah.number}
            </button>
          );
        })}
      </div>

      <div className="progress-hover-line">
        {hovered ? (
          <span>
            <em>{hovered.number}. {hovered.name_english}</em>
            <span className="arabic-name"> {hovered.name_arabic}</span>
            {listened.includes(hovered.number) && <span className="progress-check"> · listened</span>}
          </span>
        ) : (
          <span className="progress-hint">Hover a mark to see its surah</span>
        )}
      </div>

      <div className="progress-visual-footer">
        <div className="progress-visual-bar">
          <div className="progress-visual-fill" style={{ width: percent + '%' }} />
        </div>
        <p className="progress-visual-percent">{percent}% of your listening journey complete</p>
      </div>

      <div className="verse-plate">
        <p className="heart-verse">
          يَـٰٓأَيُّهَا ٱلنَّاسُ قَدْ جَآءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَآءٌ لِّمَا فِى ٱلصُّدُورِ
        </p>
        <p className="heart-verse-translation">
          "O mankind, there has come to you instruction from your Lord, and healing for what is in the hearts."
          <span className="heart-verse-ref"> — Yūnus 10:57</span>
        </p>
      </div>
    </div>
  );
}

export default ProgressVisual;