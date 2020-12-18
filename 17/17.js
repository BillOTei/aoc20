const fs = require("fs");

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const input = contents
    .split("\n")
    .map((l, y) => l.split('')
      .reduce((acc, p, x) => p === '#' ? [...acc, [x, y, 0]] : acc, []));

  // TODO

  console.log(input)
});
