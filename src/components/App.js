import { useState, useRef, useEffect } from 'react';

import '../styles/app.css';

import Board from './Board';
import TopBoard from './TopBoard';

function App() {
  const [flags, setFlags] = useState(0);

  const [level, setLevel] = useState('beginner');
  const changedLevel = useRef(false);

  // timer states
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const endOfGame = useRef(false);
  const gridSize = useRef(81);
  const clickedTile = useRef(null);

  const createBlankBoard = () => {
    return new Array(gridSize.current).fill(0);
  };

  // initialized board and mineBoard to a blank board
  const [board, setBoard] = useState(createBlankBoard());
  const mineBoard = useRef(createBlankBoard());

  useEffect(() => {
    if (changedLevel.current === true) {
      changedLevel.current = false;
      level === 'beginner'
        ? (gridSize.current = 81)
        : level === 'intermediate'
        ? (gridSize.current = 16 * 16)
        : (gridSize.current = 30 * 16);
      resetGame();
    }
  }, [level]);

  const resetGame = () => {
    setSeconds(0);
    setIsActive(false);
    endOfGame.current = false;
    setFlags(0);
    setBoard(createBlankBoard);
    mineBoard.current = createBlankBoard();
  };

  const formattedTime = (sec) => {
    //formats the time to a string
    // const hours = Math.floor(sec / 3600);
    let minutes = Math.floor(sec / 60);
    let secs = sec % 60;

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (secs < 10) {
      secs = `0${secs}`;
    }

    return `${minutes}:${secs}`;
  };

  const processMouseUp = () => {
    // un-highlights the tile on mouse up
    if (!endOfGame.current && clickedTile.current) {
      if (clickedTile.current.className === 'board-grid clicking') {
        clickedTile.current.classList.remove('clicking');
      }
      clickedTile.current = null;
    }
  };

  // adds mouseup to entire document incase mouse is dragged while down
  document.addEventListener('mouseup', processMouseUp);

  return (
    <div className="App">
      <div className="app-container">
        {/* <button onClick={createMines}>Start</button> */}
        <TopBoard
          endOfGame={endOfGame}
          seconds={seconds}
          setSeconds={setSeconds}
          isActive={isActive}
          formattedTime={formattedTime}
          flags={flags}
          resetGame={resetGame}
          setLevel={setLevel}
          changedLevel={changedLevel}
          level={level}
        />
        <Board
          board={board}
          setBoard={setBoard}
          flags={flags}
          setFlags={setFlags}
          endOfGame={endOfGame}
          isActive={isActive}
          setIsActive={setIsActive}
          level={level}
          clickedTile={clickedTile}
          mineBoard={mineBoard}
        />
      </div>
    </div>
  );
}

export default App;
