const fs = require("fs");

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const map = contents.split("\n");

  const rows = map.length;
  const cols = map[0].length;

  let playing = false;

  let grid = new Array(rows);
  let nextGrid = new Array(rows);
  let prevGrid = new Array(rows);

  function initializeGrids() {
    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(cols);
      nextGrid[i] = new Array(cols);
      prevGrid[i] = new Array(cols);
    }
  }

  function initState(i, j) {
    return map[i].charAt(j);
  }

  function resetGrids() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = initState(i, j);
        nextGrid[i][j] = initState(i, j);
        prevGrid[i][j] = initState(i, j);
      }
    }
  }

  function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        prevGrid[i][j] = grid[i][j];
        grid[i][j] = nextGrid[i][j];
      }
    }
  }

// Initialize
  function initialize() {
    initializeGrids();
    resetGrids();
    playing = true;
  }

  function computeNextGen(emptyThreshold) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        applyRules(i, j, emptyThreshold);
      }
    }

    // copy NextGrid to grid, and reset nextGrid
    copyAndResetGrid();
  }

// RULES
//   If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
//   If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
//   Otherwise, the seat's state does not change.
  function applyRules(row, col, emptyThreshold) {
    let numNeighbors = countAllNeighbors(row, col);
    if (isAlive(row, col) && numNeighbors >= emptyThreshold) {
      nextGrid[row][col] = 'L';
    } else if (grid[row][col] === 'L' && numNeighbors === 0) {
      nextGrid[row][col] = '#';
    }
  }

  function isAlive(row, col) {
    return grid[row][col] === '#';
  }

  function isFree(row, col) {
    return grid[row][col] === 'L';
  }

  function countNeighbors(row, col) {
    let count = 0;
    if (row - 1 >= 0) {
      if (isAlive(row - 1, col)) count++;
    }
    if (row - 1 >= 0 && col - 1 >= 0) {
      if (isAlive(row - 1, col - 1)) count++;
    }
    if (row - 1 >= 0 && col + 1 < cols) {
      if (isAlive(row - 1, col + 1)) count++;
    }
    if (col - 1 >= 0) {
      if (isAlive(row, col - 1)) count++;
    }
    if (col + 1 < cols) {
      if (isAlive(row, col + 1)) count++;
    }
    if (row + 1 < rows) {
      if (isAlive(row + 1, col)) count++;
    }
    if (row + 1 < rows && col - 1 >= 0) {
      if (isAlive(row + 1, col - 1)) count++;
    }
    if (row + 1 < rows && col + 1 < cols) {
      if (isAlive(row + 1, col + 1)) count++;
    }
    return count;
  }

  function countVertically(row, col, incr, count) {
    if (incr < 0 && row + incr >= 0) {
      if (isAlive(row + incr, col)) {
        return count + 1;
      } else if (isFree(row + incr, col)) {
        return count;
      } else {
        return countVertically(row + incr, col, incr, count);
      }
    } else if (incr > 0 && row + incr < rows) {
      if (isAlive(row + incr, col)) {
        return count + 1;
      } else if (isFree(row + incr, col)) {
        return count;
      } else {
        return countVertically(row + incr, col, incr, count);
      }
    } else {
      return count;
    }
  }

  function countHorizontally(row, col, incr, count) {
    if (incr < 0 && col + incr >= 0) {
      if (isAlive(row, col + incr)) {
        return count + 1;
      } else if (isFree(row, col + incr)) {
        return count;
      } else {
        return countHorizontally(row, col + incr, incr, count);
      }
    } else if (incr > 0 && col + incr < cols) {
      if (isAlive(row, col + incr)) {
        return count + 1;
      } else if (isFree(row, col + incr)) {
        return count;
      } else {
        return countHorizontally(row, col + incr, incr, count);
      }
    } else {
      return count;
    }
  }

  function countDiagonally(row, col, incrR, incrC, count) {
    if (incrR < 0 && incrC < 0 && row + incrR >= 0 && col + incrC >= 0) {
      if (isAlive(row + incrR, col + incrC)) {
        return count + 1;
      } else if (isFree(row + incrR, col + incrC)) {
        return count;
      } else {
        return countDiagonally(row + incrR, col + incrC, incrR, incrC, count);
      }
    } else if (incrR < 0 && incrC > 0 && row + incrR >= 0 && col + incrC < cols) {
      if (isAlive(row + incrR, col + incrC)) {
        return count + 1;
      } else if (isFree(row + incrR, col + incrC)) {
        return count;
      } else {
        return countDiagonally(row + incrR, col + incrC, incrR, incrC, count);
      }
    } else if (incrR > 0 && incrC < 0 && row + incrR < rows && col + incrC >= 0) {
      if (isAlive(row + incrR, col + incrC)) {
        return count + 1;
      } else if (isFree(row + incrR, col + incrC)) {
        return count;
      } else {
        return countDiagonally(row + incrR, col + incrC, incrR, incrC, count);
      }
    } else if (incrR > 0 && incrC > 0 && row + incrR < rows && col + incrC < cols) {
      if (isAlive(row + incrR, col + incrC)) {
        return count + 1;
      } else if (isFree(row + incrR, col + incrC)) {
        return count;
      } else {
        return countDiagonally(row + incrR, col + incrC, incrR, incrC, count);
      }
    } else {
      return count;
    }
  }

  function countAllNeighbors(row, col) {
    let count = 0;
    count = countVertically(row, col, -1, count);
    count = countVertically(row, col, 1, count);
    count = countHorizontally(row, col, -1, count);
    count = countHorizontally(row, col, 1, count);
    count = countDiagonally(row, col, -1, -1, count);
    count = countDiagonally(row, col, -1, 1, count);
    count = countDiagonally(row, col, 1, -1, count);
    count = countDiagonally(row, col, 1, 1, count);

    return count;
  }

  function isStable() {
    let check = true;
    outer:
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (grid[i][j] !== prevGrid[i][j]) {
            check = false;
            break outer;
          }
        }
      }

    return check;
  }

// Start everything
  initialize();
  while (playing) {
    computeNextGen(5);
    if (isStable()) {
      playing = false;
    }
  }

  console.log(grid.reduce((acc, row) => acc + row.reduce((acc2, seat) => seat === '#' ? acc2 + 1 : acc2, 0), 0));
});
