import { useState, useRef } from 'react';
import Board from './Board';

function App() {
  const blank_board = new Array(81).fill(0);

  // 81 tiles - pick 10 out of 81
  const [flags, setFlags] = useState(0);
  const [board, setBoard] = useState([...blank_board]);

  const mineBoard = useRef([]);
  const endOfGame = useRef(false);

  const createMines = () => {
    // creates an array of nums from 1-81
    let grid = [...Array(82).keys()].slice(1);
    let board_copy = [...board];
    for (let i = 0; i < 10; i++) {
      // adds the number at grid index mine as a mine
      // grid[mine] is 2 then the index the board is 1
      // mine will be an index in grid
      let mine = Math.floor(Math.random() * grid.length);
      board_copy = [
        ...board_copy.slice(0, grid[mine]),
        'x',
        ...board_copy.slice(grid[mine] + 1),
      ];
      // removes the mine that was just added
      grid.splice(mine, 1);
      console.log('set mine', grid[mine]);
    }
    mineBoard.current = [...board_copy];
    setBoard(board_copy);
  };

  return (
    <div className="App">
      {/* App top board: mines set, reset, timer board */}
      hello
      <button onClick={createMines}>Start</button>
      <Board
        board={board}
        setBoard={setBoard}
        flags={flags}
        setFlags={setFlags}
        mineBoard={[...mineBoard.current]}
        endOfGame={endOfGame}
      />
    </div>
  );
}

export default App;
