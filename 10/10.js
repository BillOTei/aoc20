const fs = require("fs");

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  let adaptersMap = [];
  const adapters = [0, ...contents
    .split("\n")
    .map(x => {
      const val = parseInt(x, 10);
      adaptersMap[val] = true;

      return val;
    })]
    .sort((a, b) => a - b);
  const adaptersCount = adapters.length;

  const nextAvailableAdapter = (joltage, incr, maxIncr) => {
    if (incr > maxIncr) {
      return -666;
    } else if (adaptersMap[joltage + incr]) {
      return joltage + incr;
    } else {
      return nextAvailableAdapter(joltage, incr + 1, maxIncr);
    }
  }

  const nextAvailableAdapters = (joltage, incr, maxIncr, acc) => {
    if (incr > maxIncr) {
      return acc;
    } else if (adaptersMap[joltage + incr]) {
      return nextAvailableAdapters(joltage, incr + 1, maxIncr, [...acc, joltage + incr]);
    } else {
      return nextAvailableAdapters(joltage, incr + 1, maxIncr, acc);
    }
  }

  const run1 = (i, oneJoltCount, threeJoltsCount) => {
    if (i === adaptersCount) {
      return oneJoltCount * threeJoltsCount;
    }
    const joltage = adapters[i];
    const nextAdapterJoltage = nextAvailableAdapter(joltage, 1, 3);

    return run1(
      i + 1,
      nextAdapterJoltage - joltage === 1 ? oneJoltCount + 1 : oneJoltCount,
      nextAdapterJoltage - joltage === 3 ? threeJoltsCount + 1 : threeJoltsCount
    );
  }

  let ways = adapters.map((x, i) => (i === 0 ? 1 : 0));

  for (let i = 0; i < ways.length; i++) {
    for (let j = i - 3; j < i; j++) {
      if (adapters[i] <= adapters[j] + 3) {
        ways[i] += ways[j];
      }
    }
  }

  console.log(ways[adaptersCount - 1]);
});
