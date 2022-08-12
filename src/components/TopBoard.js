import React from 'react';
import Timer from './Timer';

import '../styles/topboard.css';

const TopBoard = (props) => {
  const {
    seconds,
    setSeconds,
    isActive,
    formattedTime,
    flags,
    resetGame,
    setLevel,
    changedLevel,
  } = props;

  const changeLevel = (e) => {
    changedLevel.current = true;
    setLevel(e.target.value);
  };
  return (
    <div>
      <select
        id="difficulty-level"
        name="difficulty level"
        onChange={changeLevel}
      >
        <option value="beginner">Beginner 9x9</option>
        <option value="intermediate">Intermediate 16x16</option>
        <option value="expert">Expert 30x16</option>
      </select>
      <div className="top-board">
        <div className="top-container flags">
          <div className="top-text-box">{flags}</div>
        </div>
        <div className="top-container">
          <button className="reset-button" onClick={resetGame}>
            Cool
          </button>
        </div>
        <div className="top-container timer">
          <div className="top-text-box">
            <Timer
              seconds={seconds}
              setSeconds={setSeconds}
              isActive={isActive}
              formattedTime={formattedTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBoard;
