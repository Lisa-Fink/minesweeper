import { useState, useRef, useEffect } from 'react';

import '../styles/app.css';

import Board from './Board';
import TopBoard from './TopBoard';

function App() {
  const [flags, setFlags] = useState(0);
  const [board, setBoard] = useState([]);

  const [level, setLevel] = useState('beginner');
  const changedLevel = useRef(false);

  // timer states
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const mineBoard = useRef([]);
  const endOfGame = useRef(false);
  const set_mines = useRef(false);
  const gridSize = useRef(81);

  // set the mines the first time the game loads
  useEffect(() => {
    if (!set_mines.current) {
      createMines();
      set_mines.current = true;
    }
  }, []);

  useEffect(() => {
    if (changedLevel.current === true) {
      changedLevel.current = false;
      console.log('level use effect');
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
    createMines();
  };

  const createMines = () => {
    const mineCount =
      level === 'beginner' ? 10 : level === 'intermediate' ? 40 : 99;
    // creates an array of nums from 0-80
    let grid = [...Array(gridSize.current).keys()];
    const blank_board = new Array(gridSize.current).fill(0);
    let board_copy = [...blank_board];
    for (let i = 0; i < mineCount; i++) {
      // adds the index at grid index mine as a mine
      let mine = Math.floor(Math.random() * grid.length);
      board_copy = [
        ...board_copy.slice(0, grid[mine]),
        'x',
        ...board_copy.slice(grid[mine] + 1),
      ];
      console.log('set mine', grid[mine] + 1);
      // removes the mine that was just added
      grid.splice(mine, 1);
    }
    mineBoard.current = [...board_copy];
    setBoard(board_copy);
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
        />
        <Board
          board={board}
          setBoard={setBoard}
          flags={flags}
          setFlags={setFlags}
          mineBoard={[...mineBoard.current]}
          endOfGame={endOfGame}
          isActive={isActive}
          setIsActive={setIsActive}
          level={level}
        />
      </div>
    </div>
  );
}

export default App;
