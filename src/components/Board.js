import React from 'react';
import { useState, useEffect, useRef } from 'react';
import '../styles/board.css';

function Board(props) {
  // board starts with 81 zeros
  // zero means open
  // f means flagged
  // 1-8 is number of mines. only appears on unopen grids after clicking
  // u is unopen but blank
  // x is a mine (game over)

  const { board, setBoard, flags, setFlags } = props;
  const cellsToCheck = useRef(new Set());

  const nums = '12345678';

  const processClick = (e) => {
    console.log(e.target.id);
    const cell = e.target.id;
    if (board[cell - 1] === 0) {
      console.log('board on clicked cell: ', board[cell - 1]);
      clearCells(cell);
      //TODO change surrounding cells to blank or numbers
    } else if (board[cell - 1] === 'x') {
      console.log('game over');
    }
  };

  const processFlag = (e) => {
    e.preventDefault();
    console.log(e.target.id);
    const cell = e.target.id;
    if (board[cell - 1] === 0) {
      setBoard([...board.slice(0, cell - 1), 'f', ...board.slice(cell)]);
      setFlags([...flags, cell]);
    }
  };
  let clearCellsStepOne = useRef(false);
  let currentCell = useRef(0);

  const clearCells = (cell) => {
    console.log('starting clear cells with: ', cell);
    // check adjacent cells on surround cells
    // (if adjacent cells are off the edge of the board do not check)

    // if there is a mine in those locations, add numbers appropriately
    // if not a mine then run clearCells(onThisCell)
    let new_board = [...board];

    const mineCount = findMines(cell);
    if (!mineCount) {
      new_board = [
        ...new_board.slice(0, cell - 1),
        'u',
        ...new_board.slice(cell),
      ];
    } else {
      new_board = [
        ...new_board.slice(0, cell - 1),
        mineCount,
        ...new_board.slice(cell),
      ];
    }
    clearCellsStepOne.current = true;
    currentCell.current = cell;
    setBoard(new_board);
    console.log('use effect should trigger here');
  };

  const clearCells2 = (adjCell) => {
    let newBoard = [...board];

    console.log('check in adjacent: ', adjCell);
    let adj = adjacentRef.current;
    adj.delete(adjCell);
    adjacentRef.current = adj;

    if (parseInt(board[adjCell - 1]) === 0) {
      const mineCount = findMines(adjCell);
      console.log('minecount: ', mineCount);
      if (!mineCount) {
        // clearCells(adjCell);
        cellsToCheck.current = cellsToCheck.current.add(adjCell);
        console.log('added to cells to check: ', adjCell);
      } else {
        newBoard = [
          ...newBoard.slice(0, adjCell - 1),
          mineCount,
          ...newBoard.slice(adjCell),
        ];
        console.log('set mine count', adjCell, ':', mineCount);
        setBoard(newBoard);
      }
    } else {
      if (adjacentRef.current.size > 0) {
        let current = [...adjacentRef.current][0];
        clearCells2(current);
      }
    }
  };

  const adjacentRef = useRef(new Set());

  useEffect(() => {
    console.log('use effect top');
    if (clearCellsStepOne.current === true) {
      clearCellsStepOne.current = false;

      console.log(currentCell.current, ' set to U');

      let copy = cellsToCheck.current;
      copy.delete(currentCell.current);
      cellsToCheck.current = copy;

      const adjacent = findAdjacent(currentCell.current);
      adjacent.forEach((cell) => adjacentRef.current.add(cell));
      console.log('adj ref', adjacentRef.current);
      if (adjacentRef.current.size > 0) {
        let current = [...adjacentRef.current][0];
        clearCells2(current);
      }

      if (cellsToCheck.current.size > 0) {
        console.log('in cells to check: ');
        let checking = [...cellsToCheck.current][0];
        clearCells(checking);
      }
      // for (const cell of cellsToCheck.current) {
      //   console.log('in cells to check: ', cell);
      //   let checking = cell;
      //   clearCells(checking);
      // }
    } else {
      if (adjacentRef.current.size > 0) {
        let current = [...adjacentRef.current][0];
        clearCells2(current);
      }
      if (cellsToCheck.current.size > 0) {
        console.log('in cells to check: ');
        let checking = [...cellsToCheck.current][0];
        clearCells(checking);
      }
    }
  }, [board]);

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
    console.log('adjacent', adjacent, 'cell', cell);
    return adjacent;
  };

  const findMines = (cell) => {
    // take a cell, and return the total mines in its adjacent cells
    const cellsArr = findAdjacent(cell);
    let mineCount = 0;
    for (let cell of cellsArr) {
      if (board[cell - 1] === 'x') {
        mineCount++;
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
