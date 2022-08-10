import React from 'react';
import { useEffect } from 'react';

const Timer = (props) => {
  const { seconds, setSeconds, isActive, formattedTime } = props;
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      //clean up
      return () => clearInterval(interval);
    }
  }, [isActive, setSeconds]);
  return <div>{formattedTime(seconds)}</div>;
};

export default Timer;
