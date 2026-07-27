// Goal.js - Lets the user set a target date to finish listening to the
// whole Qur'an, and shows their progress against that goal.

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
    <div style={{ padding: '16px 0' }}>
      {savedDate ? (
        <div>
          <p>
            <strong>{props.listenedCount} / 114</strong> surahs listened
            — <strong>{daysLeft}</strong> {daysLeft === 1 ? 'day' : 'days'} left to reach your goal
          </p>
          <small>Goal: finish by {savedDate}</small>
          <br />
          <button onClick={() => setSavedDate(null)} style={{ marginTop: '8px' }}>
            Change Goal
          </button>
        </div>
      ) : (
        <div>
          <p><strong>{props.listenedCount} / 114</strong> surahs listened</p>
          <label>Set a goal — finish listening by: </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
          <button onClick={handleSetGoal} style={{ marginLeft: '8px' }}>
            Set Goal
          </button>
        </div>
      )}
    </div>
  );
}

export default Goal;