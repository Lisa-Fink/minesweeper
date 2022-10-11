import React from 'react';
import { useEffect, useRef } from 'react';
import '../styles/board.css';
import flag from '../img/flag.png';
import bomb from '../img/mine.png';

// TODO change tile on hover and click down. remove u. a lot of styling

function Board(props) {
  // board starts with 81 zeros
  // zero means open
  // f means flagged
  // 1-8 is number of mines. only appears on unopened grids after clicking
  // u is unopened but blank
  // x is a mine (game over if clicked)

  const {
    board,
    setBoard,
    flags,
    setFlags,
    mineBoard,
    endOfGame,
    isActive,
    setIsActive,
    level,
    clickedTile,
  } = props;

  const flagCheck = useRef(false);
  const checkWin = useRef(false);

  let cellsToCheck = [];
  const cellsChecked = new Set();
  let copyBoard = [];

  const processClick = (e) => {
    if (!endOfGame.current) {
      if (!isActive) {
        setIsActive(true);
      }
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
      let cell = e.target.id;
      if (e.target.alt === 'flag') {
        cell = e.target.parentNode.id;
      }
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
        (board[cell - 1] === 'x')
      ) {
        flagCheck.current = true;
        setBoard([...board.slice(0, cell - 1), 'f', ...board.slice(cell)]);
        setFlags(flag_count + 1);
      }
    }
  };

  const clearCells = (cell) => {
    if (!cellsToCheck.length) {
      // create a copy of board. the copy will be updated until all cells
      // have been cleared, then board state will be updated and re rendered
      copyBoard = [...board];
    }
    // cellsToCheck will have len after first cycle. This will remove the
    // cell that is currently being checked
    else if (cellsToCheck.length && cellsToCheck[0] === cell) {
      cellsToCheck = cellsToCheck.slice(1);
    }

    cellsChecked.add(cell);

    /*    find value for cell by checking for mines
    if it is a number - change cell to number - do nothing else
    if it is a u, -change cell to u - add adjacent to cellToCheck
    if it is a flag do nothing - and check cellToCheck length */

    const mines = findMines(cell);

    if (copyBoard[cell - 1] !== 'f') {
      if (mines) {
        // change cell on copyBoard to numbers of surrounding mines
        copyBoard[cell - 1] = mines;
      } else if (parseInt(copyBoard[cell - 1]) === 0) {
        // change cell on board to u
        // add adjacent to cellsToCheck
        const adjacent = findAdjacent(cell);
        for (const adj of adjacent) {
          if (parseInt(copyBoard[adj - 1]) === 0) {
            if (!cellsChecked.has(adj)) {
              cellsToCheck.push(adj);
            }
          }
        }
        copyBoard[cell - 1] = 'u';
      }
    }
    if (cellsToCheck.length) {
      clearCells(cellsToCheck[0]);
    } else {
      checkWin.current = true;
      cellsChecked.clear();
      setBoard(copyBoard);
    }
  };

  useEffect(() => {
    if (flagCheck.current === true) {
      flagCheck.current = false;
      checkWin.current = true;
    }
    if (checkWin.current) {
      checkWin.current = false;
      let isEnd = 'checking';
      for (const index in board) {
        if (
          (board[index] === 0) |
          (board[index] === 'f' && mineBoard[index] !== 'x') |
          (board[index] === 'x')
        ) {
          isEnd = false;
          break;
        }
      }
      if (isEnd !== false) {
        endOfGame.current = 'win';
        gameEnd();
      }
    }
  }, [board]);

  const gameEnd = () => {
    setIsActive(false);
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
    const rowLen =
      level === 'beginner' ? 9 : level === 'intermediate' ? 16 : 30;
    // check if not left edge
    if (cell % rowLen !== 1) {
      left_edge = false;
      adjacent.push(cell - 1);
    }
    // check if not right edge
    if (cell % rowLen !== 0) {
      right_edge = false;
      adjacent.push(cell + 1);
    }
    //check if not top edge
    if (cell > rowLen) {
      !left_edge && adjacent.push(cell - (rowLen + 1));
      !right_edge && adjacent.push(cell - (rowLen - 1));
      adjacent.push(cell - rowLen);
    }
    //check if not bottom edge
    if (
      cell < (level === 'beginner' ? 73 : level === 'intermediate' ? 241 : 451)
    ) {
      !left_edge && adjacent.push(cell + (rowLen - 1));
      !right_edge && adjacent.push(cell + (rowLen + 1));
      adjacent.push(cell + rowLen);
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

  const content = (grid) => {
    if (grid === 'f') {
      return <img src={flag} className="tile-img" alt="flag" />;
    } else if (grid === 'x' && endOfGame.current) {
      return <img src={bomb} className="tile-img" alt="mine" />;
    } else if (grid !== 0 && grid !== 'u' && grid !== 'x') {
      return grid;
    }
  };

  const processMousePress = (e, grid) => {
    if (!endOfGame.current && !clickedTile.current) {
      let tile = e.target.alt === 'flag' ? e.target.parentNode.id : e.target.id;
      clickedTile.current = document.getElementById(tile);
      clickedTile.current.classList.add('clicking');
    }
  };

  const boardGrid = board.map((grid, key) => {
    return (
      <div
        className={
          (grid === 'u') | (Number(grid) && grid > 0 && grid < 9)
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
        onMouseDown={(e) => processMousePress(e, grid)}
        onContextMenu={processFlag}
      >
        {content(grid)}
      </div>
    );
  });

  return (
    <div>
      <div
        className={`board-container ${level}`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {boardGrid}
      </div>
    </div>
  );
}

export default Board;
