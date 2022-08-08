import { useState } from 'react';

function App() {
  // 81 tiles - pick 10 out of 81
  const [mines, setMines] = useState([]);
  const [clicked, setClicked] = useState([]);

  const createMines = () => {
    let grid = [...Array(82).keys()].slice(1);

    for (let i = 0; i < 10; i++) {
      // mine will be an index in mine
      let mine = Math.floor(Math.random() * grid.length);

      // adds the number at grid index mine as a mine
      setMines([...mines, grid[mine]]);
      // removes the mine that was just added
      grid = grid.slice(0, mine).concat(grid.slice(mine + 1));
    }
  };

  return (
    <div className="App">
      {/* App top board: mines set, reset, timer board */}
      hello
      <button onClick={createMines}>Start</button>
    </div>
  );
}

export default App;
