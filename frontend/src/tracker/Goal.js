// Goal.js — The tracker's headline card. Shows the user's progress as a
// large statement, with the goal target date underneath. Displays inline
// form to set or change the goal.

import { useState, useEffect } from 'react';
import './Goal.css';

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

  const formatGoalDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="goal-section">
      <p className="section-eyebrow">Your Progress</p>
      <div className="goal-stat">
        <span className="goal-stat-number">{props.listenedCount}</span>
        <span className="goal-stat-slash">/</span>
        <span className="goal-stat-total">114</span>
        <span className="goal-stat-label">surahs listened</span>
      </div>

      {savedDate ? (
        <div className="goal-details">
          <p className="goal-target">
            <em>Aiming to finish by</em> <span className="goal-date">{formatGoalDate(savedDate)}</span>
          </p>
          <p className="goal-days">
            <span className="goal-days-number">{daysLeft}</span>
            <em> {daysLeft === 1 ? 'day' : 'days'} remaining</em>
          </p>
          <button className="btn-small" onClick={() => setSavedDate(null)}>
            Change goal
          </button>
        </div>
      ) : (
        <div className="goal-details">
          <p className="goal-target"><em>Set a goal to guide your journey</em></p>
          <div className="goal-form">
            <label>Finish by</label>
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