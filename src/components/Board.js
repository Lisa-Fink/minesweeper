import React from 'react';
import { useState } from 'react';
import '../styles/board.css';

function Board(props) {
  // board starts with 81 zeros
  // zero means open
  // f means flagged
  // 1-8 is number of mines. only appears on unopen grids after clicking
  // u is unopen but blank
  // x is a mine (game over)

  const { board, setBoard, flags, setFlags } = props;

  const nums = '12345678';

  const processClick = (e) => {
    console.log(e.target.id);
    const tile = e.target.id;
    if (board[tile - 1] === 0) {
      setBoard([...board.slice(0, tile - 1), 'u', ...board.slice(tile)]);
      //TODO change surrounding tiles to blank or numbers
    } else if (board[tile - 1] === 'x') {
      console.log('game over');
    }
  };

  const boardGrid = board.map((grid, key) => {
    return (
      <div
        className={
          (grid === 'u') | nums.includes(grid)
            ? 'board-grid unopen'
            : 'board-grid'
        }
        key={key}
        id={key + 1}
        onClick={processClick}
      >
        {grid !== 0 && grid !== 'x' && grid}
      </div>
    );
  });

  return (
    <div>
      Board
      <div className="board-container">{boardGrid}</div>
    </div>
  );
}

export default Board;
