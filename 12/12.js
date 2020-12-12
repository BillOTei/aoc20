const fs = require("fs");
let Complex = require('complex.js');

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const coordinates = contents
    .split("\n")
    .map(x => [x.substr(0, 1), parseInt(x.substr(1), 10)]);
  const len = coordinates.length;

  const move = (i, pos, dir) => {
    if (i >= len) {
      return Math.abs(pos.re) + Math.abs(pos.im);
    }
    const [action, value] = coordinates[i];
    switch (action) {
      case 'N':
        return move(i + 1, pos.add(new Complex(value, 0)), dir);
      case 'S':
        return move(i + 1, pos.sub(new Complex(value, 0)), dir);
      case 'E':
        return move(i + 1, pos.add(new Complex(0, value)), dir);
      case 'W':
        return move(i + 1, pos.sub(new Complex(0, value)), dir);
      case 'L':
        return move(i + 1, pos, dir.mul({abs: 1, arg: -1 * value * (Math.PI / 180)}));
      case 'R':
        return move(i + 1, pos, dir.mul({abs: 1, arg: value * (Math.PI / 180)}));
      case 'F':
        return move(i + 1, pos.add(dir.mul(value)), dir);
    }
  }

  const move2 = (i, pos, wayP) => {
    if (i >= len) {
      return Math.round(Math.abs(pos.re) + Math.abs(pos.im));
    }
    const [action, value] = coordinates[i];
    switch (action) {
      case 'N':
        return move2(i + 1, pos, wayP.add(new Complex(value, 0)));
      case 'S':
        return move2(i + 1, pos, wayP.sub(new Complex(value, 0)));
      case 'E':
        return move2(i + 1, pos, wayP.add(new Complex(0, value)));
      case 'W':
        return move2(i + 1, pos, wayP.sub(new Complex(0, value)));
      case 'L':
        return move2(i + 1, pos, wayP.mul({abs: 1, arg: -1 * value * (Math.PI / 180)}));
      case 'R':
        return move2(i + 1, pos, wayP.mul({abs: 1, arg: value * (Math.PI / 180)}));
      case 'F':
        return move2(i + 1, pos.add(wayP.mul(value)), wayP);
    }
  }

  console.log(move2(0, new Complex(0, 0), new Complex(1, 10)));
});
