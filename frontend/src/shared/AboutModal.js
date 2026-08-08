// AboutModal.js — Explains what Quran Companion is and how to use it.
// Serves double duty: (1) always accessible via the "About" link in the
// navbar, and (2) auto-shown on a user's first visit, dismissing forever
// once they close it (stored locally so it never nags again).

import './AboutModal.css';

function AboutModal(props) {
  return (
    <div className="modal-overlay" onClick={props.onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={props.onClose} aria-label="Close">×</button>

        {props.firstTime && (
          <p className="modal-eyebrow">Welcome</p>
        )}

        <h2 className="modal-title">
          {props.firstTime ? 'Begin your Qur\'an journey' : 'About this companion'}
        </h2>

        <p className="modal-lead">
          A quiet place to keep company with the Qur'an —
          to listen, to reflect, and to remember what stayed with you.
        </p>

        <div className="modal-section">
          <p className="modal-section-title">The Tracker</p>
          <p className="modal-section-text">
            Set a goal to finish listening to the whole Qur'an by a date that's meaningful to you.
            Mark each surah as you listen. Your progress fills in over time.
          </p>
        </div>

        <div className="modal-section">
          <p className="modal-section-title">The Journal</p>
          <p className="modal-section-text">
            After you listen to a surah, you'll be gently invited to reflect on what stayed with you.
            Your reflections become a private book you can return to, page by page — a personal
            record of your relationship with the Qur'an over time.
          </p>
        </div>

        <div className="modal-section">
          <p className="modal-section-title">A note on the text</p>
          <p className="modal-section-text">
            All Qur'anic text in this app is drawn from a verified source
            (the Al Quran Cloud API) — never generated. Correctness of the sacred text is treated as
            non-negotiable.
          </p>
        </div>

        <div className="modal-verse">
          <p className="heart-verse">إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا</p>
          <p className="heart-verse-translation">
            "Indeed, with hardship comes ease." <span className="heart-verse-ref">— Ash-Sharh 94:6</span>
          </p>
        </div>

        <button className="btn-primary" onClick={props.onClose} style={{ maxWidth: '240px', margin: '20px auto 0', display: 'block' }}>
          {props.firstTime ? 'Begin' : 'Close'}
        </button>
      </div>
    </div>
  );
}

export default AboutModal;