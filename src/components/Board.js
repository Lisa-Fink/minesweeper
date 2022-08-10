import React from 'react';
import { useEffect, useRef } from 'react';
import '../styles/board.css';

function Board(props) {
  // board starts with 81 zeros
  // zero means open
  // f means flagged
  // 1-8 is number of mines. only appears on unopened grids after clicking
  // u is unopened but blank
  // x is a mine (game over if clicked)

  const { board, setBoard, flags, setFlags, mineBoard, endOfGame } = props;

  const cellsToCheck = useRef([]);
  const flagCheck = useRef(false);
  const checkWin = useRef(false);

  const nums = '12345678';

  const processClick = (e) => {
    if (!endOfGame.current) {
      console.log(e.target.id);
      const cell = e.target.id;
      if (mineBoard[cell - 1] === 'x') {
        endOfGame.current = 'lose';
        gameEnd();
      } else if (board[cell - 1] === 0) {
        clearCells(cell);
      }
    }
  };

  const processFlag = (e) => {
    e.preventDefault();
    if (!endOfGame.current) {
      const cell = e.target.id;
      const flag_count = flags;
      if (board[cell - 1] === 'f') {
        if (mineBoard[cell - 1] === 'x') {
          flagCheck.current = true;
          setFlags(flag_count - 1);
          setBoard([...board.slice(0, cell - 1), 'x', ...board.slice(cell)]);
        } else {
          flagCheck.current = true;
          setFlags(flag_count - 1);
          setBoard([...board.slice(0, cell - 1), 0, ...board.slice(cell)]);
        }
      } else if (
        (parseInt(board[cell - 1]) === 0) |
        (mineBoard[cell - 1] === 'x')
      ) {
        flagCheck.current = true;
        setBoard([...board.slice(0, cell - 1), 'f', ...board.slice(cell)]);
        setFlags(flag_count + 1);
      }
    }
  };

  const clearCells = (cell) => {
    // cellsToCheck will have len after first cycle. This will remove the
    // cell that is currently being checked

    if (cellsToCheck.current.length && cellsToCheck.current[0] === cell) {
      cellsToCheck.current = cellsToCheck.current.slice(1);
    }
    //find value for cell by checking for mines
    //if it is a number - change cell to number - do nothing else
    // if it is a u, -change cell to u - add adjacent to cellToCheck
    // if it is a flag do nothing - and check cellToCheck length

    const mines = findMines(cell);

    if (board[cell - 1] !== 'f') {
      if (mines) {
        // change cell on board to mine number
        // setBoard, then useEffect calls clearCells if cellsToCheck.length
        const newBoard = [...board];
        newBoard[cell - 1] = mines;
        setBoard(newBoard);
      } else if (parseInt(board[cell - 1]) === 0) {
        // change cell on board to u
        // add adjacent to cellsToCheck
        const adjacent = findAdjacent(cell);
        const check = [];
        for (const adj of adjacent) {
          if (parseInt(board[adj - 1]) === 0) {
            check.push(adj);
          }
        }
        let combined = [...cellsToCheck.current, ...check];
        // combines and removes duplicates
        cellsToCheck.current = [...new Set(combined)];
        // setBoard, then useEffect calls clearCells if cellsToCheck.length
        const newBoard = [...board];
        newBoard[cell - 1] = 'u';
        setBoard(newBoard);
      }
    } else {
      if (cellsToCheck.current.length) {
        clearCells(cellsToCheck.current[0]);
      }
    }
    if (!cellsToCheck.current.length) {
      checkWin.current = true;
    }
  };

  useEffect(() => {
    if (flagCheck.current === true) {
      flagCheck.current = false;
    } else if (cellsToCheck.current.length) {
      clearCells(cellsToCheck.current[0]);
    } else if (checkWin.current) {
      checkWin.current = false;
      console.log('check win');
      let isEnd = 'checking';
      for (const index in board) {
        if (
          (board[index] === 0) |
          (board[index] === 'f' && mineBoard[index] !== 'x')
        ) {
          isEnd = false;
          break;
        }
      }
      if (isEnd !== false) {
        console.log('winner');
        endOfGame.current = 'win';
        gameEnd();
      }
    }
  }, [board]);

  const gameEnd = () => {
    console.log('end of game');
    showMines();
    // TODO: set a short timeout and show menu
  };

  const showMines = () => {
    let newBoard = [...board];
    for (const index in mineBoard) {
      if (mineBoard[index] === 'x') {
        newBoard[index] = 'x';
      }
    }
    setBoard(newBoard);
  };

  const findAdjacent = (cell) => {
    let left_edge = true;
    let right_edge = true;
    const adjacent = [];
    cell = parseInt(cell);
    // check if not left edge
    if (cell % 9 !== 1) {
      left_edge = false;
      adjacent.push(cell - 1);
    }
    // check if not right edge
    if (cell % 9 !== 0) {
      right_edge = false;
      adjacent.push(cell + 1);
    }
    //check if not top edge
    if (cell > 9) {
      !left_edge && adjacent.push(cell - 10);
      !right_edge && adjacent.push(cell - 8);
      adjacent.push(cell - 9);
    }
    //check if not bottom edge
    if (cell < 73) {
      !left_edge && adjacent.push(cell + 8);
      !right_edge && adjacent.push(cell + 10);
      adjacent.push(cell + 9);
    }
    return adjacent;
  };

  const findMines = (cell) => {
    // take a cell, and return the total mines in its adjacent cells
    const cellsArr = findAdjacent(cell);
    let mineCount = 0;
    for (let cell of cellsArr) {
      if (mineBoard[cell - 1] === 'x') {
        mineCount += 1;
      }
    }
    return mineCount;
  };

  const boardGrid = board.map((grid, key) => {
    return (
      <div
        className={
          (grid === 'u') | nums.includes(grid)
            ? 'board-grid unopen'
            : endOfGame.current === 'win' && grid === 'x'
            ? 'board-grid win'
            : endOfGame.current === 'lose' && grid === 'x'
            ? 'board-grid lose'
            : 'board-grid'
        }
        key={key}
        id={key + 1}
        onClick={processClick}
        onContextMenu={processFlag}
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
