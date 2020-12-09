const fs = require("fs");

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const numbers = contents
    .split("\n")
    .map(x => parseInt(x, 10));
  const len = numbers.length;

  const combinations = (input) => {
    const len = input.length;
    let results = [];

    for (let i = 0; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {
        results[input[i] + input[j]] = true;
      }
    }

    return results;
  }

  const run = (windowSize, idx) => {
    const combs = combinations(numbers.slice(idx - windowSize, idx));
    if (!combs[numbers[idx]]) {
      return numbers[idx];
    } else {
      return run(windowSize, idx + 1);
    }
  }

  const invalid = run(25, 25);

  let res2 = 0;
  main:
    for (let i = 0; i < len - 1; i++) {
      if (numbers[i] >= invalid) {
        continue;
      }
      let sum = numbers[i];
      for (let j = i + 1; j < len; j++) {
        sum += numbers[j];
        if (sum === invalid) {
          const slice = numbers.slice(i, j);
          res2 = Math.min(...slice) + Math.max(...slice);
          break main;
        } else if (sum > invalid) {
          break;
        }
      }
    }

  console.log(res2);
});
