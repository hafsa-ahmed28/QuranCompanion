// Goal.js - Goal setting and progress display.

import { useState, useEffect } from 'react';

function Goal(props) {
  const [targetDate, setTargetDate] = useState('');
  const [daysLeft, setDaysLeft] = useState(null);
  const [savedDate, setSavedDate] = useState(null);

  const fetchGoal = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/get-goal/', {
      headers: { 'Authorization': 'Token ' + props.token },
    });
    const data = await response.json();
    if (response.ok && data.target_date) {
      setSavedDate(data.target_date);
      setDaysLeft(data.days_left);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [props.token]);

  const handleSetGoal = async () => {
    if (!targetDate) return;

    const response = await fetch('http://127.0.0.1:8000/api/set-goal/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + props.token,
      },
      body: JSON.stringify({ target_date: targetDate }),
    });

    if (response.ok) {
      await fetchGoal();
    }
  };

  return (
    <div className="goal-section">
      {savedDate ? (
        <div>
          <p className="goal-progress">
            <strong>{props.listenedCount} / 114</strong> surahs listened
            — <strong>{daysLeft}</strong> {daysLeft === 1 ? 'day' : 'days'} left
          </p>
          <p className="goal-detail">Goal: finish by {savedDate}</p>
          <button className="btn-small" onClick={() => setSavedDate(null)}>
            Change Goal
          </button>
        </div>
      ) : (
        <div>
          <p className="goal-progress">
            <strong>{props.listenedCount} / 114</strong> surahs listened
          </p>
          <div className="goal-form">
            <label>Finish listening by:</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
            <button onClick={handleSetGoal}>Set Goal</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goal;