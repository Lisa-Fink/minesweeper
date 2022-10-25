import React from 'react';
import { useEffect, useRef } from 'react';
import '../styles/board.css';
import flag from '../img/flag.png';
import bomb from '../img/mine.png';

// TODO change tile on hover and click down. remove u. a lot of styling

function Board(props) {
  /* 
  board is the displayed board, 
  starts with 81 zeros
  zero means open
  f means flagged
  1-8 is number of mines. only appears on unopened grids after clicking
  u is unopened but blank
  x is a mine (game over if clicked) 

  mineBoard holds mines and adjacent mine numbers
  */

  const {
    board,
    setBoard,
    flags,
    setFlags,
    endOfGame,
    isActive,
    setIsActive,
    level,
    clickedTile,
    mineBoard,
  } = props;

  const flagCheck = useRef(false);
  const checkWin = useRef(false);

  const processClick = (e) => {
    // if end of game ignore all clicks
    if (!endOfGame.current) {
      // check if first click
      if (!isActive) {
        // reset flag count to 0 (flags placed before start will be overwritten)
        setFlags(0);
        // create mine board, add mines to board,
        const newBoardWithMines = createMines(e.target.id - 1);
        setIsActive(true); // triggers timer
        clearCells(parseInt(e.target.id), newBoardWithMines);
        return;
      }
      const cell = e.target.id;
      if (mineBoard.current[cell - 1] === 'x') {
        endOfGame.current = 'lose';
        gameEnd();
      } else if (board[cell - 1] === 0) {
        clearCells(cell, [...board]);
      }
    }
  };

  const createMines = (first_click) => {
    const mineCount =
      level === 'beginner' ? 10 : level === 'intermediate' ? 40 : 99;

    // create array of cells except for first_click
    let gridNums = [];
    for (let i = 0; i < board.length; i++) {
      if (i !== first_click) {
        gridNums.push(i);
      }
    }

    // shuffle gridNums (Fisher-Yates shuffle)
    let lastUnshuffledIndex = gridNums.length,
      temp,
      randomIndex;
    while (lastUnshuffledIndex) {
      // Pick an element to shuffle
      randomIndex = Math.floor(Math.random() * lastUnshuffledIndex--);

      // Swap it with the current element
      temp = gridNums[lastUnshuffledIndex];
      gridNums[lastUnshuffledIndex] = gridNums[randomIndex];
      gridNums[randomIndex] = temp;
    }

    // place mines on mineBoard and update adjacent mine count
    const tempMineBoard = [...mineBoard.current];
    const tempBoard = [...mineBoard.current];
    for (let mineNum = 0; mineNum < mineCount; mineNum++) {
      tempMineBoard[gridNums[mineNum]] = 'x';
      tempBoard[gridNums[mineNum]] = 'x';
      // adjToMine returns cell numbers not indexes
      const adjToMine = findAdjacent(gridNums[mineNum] + 1);
      for (let adj of adjToMine) {
        if (tempMineBoard[adj - 1] !== 'x') tempMineBoard[adj - 1] += 1;
      }
    }
    mineBoard.current = tempMineBoard;

    return tempBoard;
  };

  const processFlag = (e) => {
    e.preventDefault();
    if (!endOfGame.current) {
      let cell = e.target.id;
      if (e.target.alt === 'flag') {
        cell = e.target.parentNode.id;
      }
      const flag_count = flags;
      const tempBoard = [...board];
      // check if removing a flag
      if (board[cell - 1] === 'f') {
        // Remove a flag

        // if the removed flag was on a mine replace the f on board to an x
        if (mineBoard.current[cell - 1] === 'x') {
          flagCheck.current = true;
          setFlags(flag_count - 1);
          tempBoard[cell - 1] = 'x';
        } else {
          // if the removed flag was on an open tile replace the f on board to a 0
          flagCheck.current = true;
          setFlags(flag_count - 1);
          tempBoard[cell - 1] = 0;
        }
      } else if (
        // Place a flag

        (parseInt(board[cell - 1]) === 0) |
        (board[cell - 1] === 'x')
      ) {
        flagCheck.current = true;

        tempBoard[cell - 1] = 'f';
        setFlags(flag_count + 1);
      }
      setBoard(tempBoard);
    }
  };

  const clearCells = (cell, copyBoard) => {
    const cellsToCheck = [cell];
    const cellsChecked = new Set();
    cellsChecked.add(cell);

    while (cellsToCheck.length) {
      /*    
      Find value for cell by checking mineBoard.
      If it is a flag do nothing.
      If it is a number > 0, there's an adjacent mine change cell to number, do nothing else.
      Otherwise it is an open cell, change cell to u, and add all adjacent 
      cells that haven't been added to cellsToCheck to cellToCheck.
      */

      let curCell = cellsToCheck.pop();

      if (copyBoard[curCell - 1] !== 'f' && copyBoard[curCell - 1] !== 'u') {
        // checks if the current cell doesn't have adjacent mines
        if (mineBoard.current[curCell - 1] === 0) {
          copyBoard[curCell - 1] = 'u';
          // add adjacent cells to be checked
          const adjacent = findAdjacent(curCell);
          for (const adj of adjacent) {
            // only add an adjacent cell if it hasn't been checked or isn't already in the array
            if (!cellsChecked.has(adj)) {
              cellsToCheck.push(adj);
              cellsChecked.add(curCell);
            }
          }
        } else {
          // current cell has adjacent mines
          copyBoard[curCell - 1] = mineBoard.current[curCell - 1];
        }
      }
    }
    checkWin.current = true;
    setBoard(copyBoard);
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
          (board[index] === 'f' && mineBoard.current[index] !== 'x') |
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
  };

  const showMines = () => {
    let newBoard = [...board];
    for (const index in mineBoard.current) {
      if (mineBoard.current[index] === 'x') {
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
    // highlights the tile on mouse down
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
