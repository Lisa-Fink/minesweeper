import React from 'react';
import Timer from './Timer';

const TopBoard = (props) => {
  const { seconds, setSeconds, isActive, formattedTime } = props;
  return (
    <div>
      top of the board
      <Timer
        seconds={seconds}
        setSeconds={setSeconds}
        isActive={isActive}
        formattedTime={formattedTime}
      />
    </div>
  );
};

export default TopBoard;
