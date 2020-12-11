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

        //nextGrid[i][j] = initState(i, j);
      }
    }
  }

// Initialize
  function initialize() {
    initializeGrids();
    resetGrids();
    playing = true;
  }

  function computeNextGen() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        applyRules(i, j);
      }
    }

    // copy NextGrid to grid, and reset nextGrid
    copyAndResetGrid();
  }

// RULES
//   If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
//   If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
//   Otherwise, the seat's state does not change.
  function applyRules(row, col) {
    let numNeighbors = countNeighbors(row, col);
    if (isAlive(row, col) && numNeighbors >= 4) {
      nextGrid[row][col] = 'L';
    } else if (grid[row][col] === 'L' && numNeighbors === 0) {
      nextGrid[row][col] = '#';
    }
  }

  function isAlive(row, col) {
    return grid[row][col] === '#';
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
    computeNextGen();
    if (isStable()) {
      playing = false;
    }
  }

  console.log(grid.reduce((acc, row) => acc + row.reduce((acc2, seat) => seat === '#' ? acc2 + 1 : acc2, 0), 0));
});
