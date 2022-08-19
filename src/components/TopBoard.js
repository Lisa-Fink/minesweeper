import React from 'react';
import Timer from './Timer';

import '../styles/topboard.css';

import cool from '../img/cool.png';

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
    level,
  } = props;

  const changeLevel = (e) => {
    changedLevel.current = true;
    setLevel(e.target.value);
  };

  const flagAmt =
    level === 'beginner' ? 10 : level === 'intermediate' ? 40 : 99;
  return (
    <div className="tb-container">
      <div className="title">MINESWEEPER</div>
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
          <div className="top-text-box">
            {flags} / {flagAmt}
          </div>
        </div>
        <div className="top-container">
          <button className="reset-button" onClick={resetGame}>
            <img src={cool} alt="Cool" className="reset-button-img" />
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
