import React from 'react';
import Timer from './Timer';

import '../styles/topboard.css';

const TopBoard = (props) => {
  const { seconds, setSeconds, isActive, formattedTime, flags } = props;
  return (
    <div className="top-board">
      <div className="top-container flags">
        <div className="top-text-box">{flags}</div>
      </div>
      <div className="top-container">
        <button className="reset-button">Cool</button>
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
  );
};

export default TopBoard;
