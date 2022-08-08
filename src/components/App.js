import { useState } from 'react';
import Board from './Board';

function App() {
  const blank_board = new Array(81).fill(0);

  // 81 tiles - pick 10 out of 81
  const [flags, setFlags] = useState([]);
  const [board, setBoard] = useState([...blank_board]);

  const createMines = () => {
    // creates an array of nums from 1-81
    let grid = [...Array(82).keys()].slice(1);

    for (let i = 0; i < 10; i++) {
      // mine will be an index in mine
      let mine = Math.floor(Math.random() * grid.length);

      // adds the number at grid index mine as a mine
      setBoard([
        ...board.slice(0, grid[mine]),
        'x',
        ...board.slice(grid[mine] + 1),
      ]);
      console.log('set mines', grid[mine]);
      // removes the mine that was just added
      grid = grid.slice(0, mine).concat(grid.slice(mine + 1));
    }
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
      />
    </div>
  );
}

export default App;
